import { useEffect, useMemo, useState } from 'react';
import { useAdmissionStore } from '@/stores/admissions';
import { usePharmacyStore } from '@/stores/pharmacy';
import { BedDouble, LogIn, LogOut, ArrowLeftRight, Building2, LayoutGrid, User, ScanLine, CheckCircle2, XCircle, AlertTriangle, Timer } from 'lucide-react';
import { useRBAC } from '@/utils/useRBAC.jsx';
import { getAuditLog } from '@/lib/audit';
import { withRetry } from '@/lib/retry';
import { validateBedVacant, reserveBed } from '@/lib/hbys';

export default function YatisPage() {
  const { wards, rooms, beds, admissions, discharges, transfers, seedDemo, admit, transfer, discharge, admissionRequests, dischargeRequests, approveAdmission, rejectAdmission, approveDischarge, rejectDischarge, requestDischarge, requestAdmission, expireAdmission, errors, clearErrors, startAutoExpire, updateAdmissionRequest, updateDischargeRequest } = useAdmissionStore();
  const [form, setForm] = useState({
    patient_id: '',
    ward_id: '',
    room_id: '',
    bed_id: '',
    attending_physician_id: '',
    treatment_type: '',
    planned_start: '',
    procedure_code: '',
    anesthesia_required: false,
    anesthesia_notes: '',
    barcode: '',
  });
  const [tab, setTab] = useState('admit'); // admit | transfer | discharge
  const [approvalMode, setApprovalMode] = useState(false);
  const [bedFilter, setBedFilter] = useState('vacant'); // all | vacant | occupied | cleaning | maintenance
  const { hasPermission } = useRBAC();
  const [modal, setModal] = useState(null); // { type, id, reason, signed_by_name, signed_by_id }
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [medModal, setMedModal] = useState(null); // { open: true }
  const pharmacy = usePharmacyStore();
  const lowStock = (pharmacy.lots||[]).reduce((acc, l)=>{
    acc[l.medication_id] = (acc[l.medication_id]||0) + (l.qty_on_hand||0);
    return acc;
  }, {});
  const lowStockCount = Object.values(lowStock).filter(v=>v<=3).length;
  const expirySoonCount = (pharmacy.lots||[]).filter(l=> (new Date(l.expiry_date).getTime()-Date.now())<7*24*3600*1000).length;
  const [stockDetailsOpen, setStockDetailsOpen] = useState(false);

  useEffect(() => {
    if (wards.length === 0) seedDemo();
    startAutoExpire(60 * 60 * 2);
  }, [wards.length, seedDemo, startAutoExpire]);

  const wardOptions = wards;
  const roomOptions = useMemo(() => rooms.filter(r => r.ward_id === form.ward_id), [rooms, form.ward_id]);
  const bedOptions = useMemo(() => beds.filter(b => b.ward_id === form.ward_id && b.room_id === form.room_id), [beds, form.ward_id, form.room_id]);
  const filteredBedOptions = useMemo(() => bedOptions.filter(b => bedFilter === 'all' ? true : b.status === bedFilter), [bedOptions, bedFilter]);

  const totalWards = wards.length;
  const totalRooms = rooms.length;
  const vacantBeds = beds.filter(b => b.status === 'vacant').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;

  const canAdmit = !!(form.patient_id && form.attending_physician_id && form.ward_id && form.room_id && form.bed_id);
  const canAdmitPermission = hasPermission('admission:create');
  const showRisk = !!form.anesthesia_required;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Hasta Yatış / Transfer / Taburcu</h1>
          <p className="text-sm text-gray-600">Servis, oda ve yatak yönetimi ile yatış, transfer ve taburcu işlemlerini buradan yönetin.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TabButton active={tab==='admit'} onClick={()=>setTab('admit')} icon={<LogIn size={16} />}>Yatış</TabButton>
        <TabButton active={tab==='transfer'} onClick={()=>setTab('transfer')} icon={<ArrowLeftRight size={16} />}>Transfer</TabButton>
        <TabButton active={tab==='discharge'} onClick={()=>setTab('discharge')} icon={<LogOut size={16} />}>Taburcu</TabButton>
        <div className="ml-auto inline-flex items-center gap-2 text-xs">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={approvalMode} onChange={(e)=>setApprovalMode(e.target.checked)} />
            Onay Akışı
          </label>
          <button className="px-2.5 py-1 rounded border bg-white hover:bg-gray-50" onClick={()=>setMedModal({ open: true })}>İlaç Uygula</button>
        </div>
      </div>

      {showRisk && (
        <div className="flex items-center gap-2 rounded border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
          <AlertTriangle size={16} />
          Anestezi gereksinimi mevcut. Hasta güvenliği kontrollerini doğrulayın.
        </div>
      )}

      {(lowStockCount>0 || expirySoonCount>0) && (
        <div className="flex items-center justify-between rounded border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
          <div>
            {lowStockCount>0 && <span className="mr-4">Düşük stoklu ilaç: {lowStockCount}</span>}
            {expirySoonCount>0 && <span>7 gün içinde SKT: {expirySoonCount}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs underline" onClick={()=>setStockDetailsOpen(true)}>Detay</button>
            <LinkButton href="/eczane" label="Eczane" />
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded border border-rose-300 bg-rose-50 text-rose-800 px-3 py-2 text-sm flex items-center justify-between">
          <div className="pr-2">
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button className="text-xs underline" onClick={async()=>{
              try {
                // Retry HBYS operations for pending admission requests (reserved beds)
                const pendings = admissionRequests.filter(r=>r.status==='pending');
                for (const r of pendings) {
                  try { await withRetry(() => validateBedVacant(r.bed_id), 1, 200); } catch {}
                  try { await withRetry(() => reserveBed(r.bed_id), 1, 200); } catch {}
                }
              } finally {}
            }}>Tekrar dene</button>
            <button className="text-xs underline" onClick={()=>setErrorsOpen(true)}>Ayrıntı</button>
            <button className="text-xs underline" onClick={clearErrors}>Temizle</button>
          </div>
        </div>
      )}

      {tab==='admit' && (
        <SectionCard title="Yeni Yatış" subtitle="Hasta, ameliyat ve yatak bilgilerini doldurun.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Hasta ID">
              <div className="relative">
                <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input placeholder="00000000-0000-0000-0000-000000000000" className="w-full border rounded pl-8 pr-2 py-2 text-sm" value={form.patient_id} onChange={(e)=>setForm(f=>({...f, patient_id: e.target.value}))} />
              </div>
            </Field>
            <Field label="Sorumlu Hekim ID">
              <input placeholder="00000000-0000-0000-0000-000000000000" className="w-full border rounded px-2 py-2 text-sm" value={form.attending_physician_id} onChange={(e)=>setForm(f=>({...f, attending_physician_id: e.target.value}))} />
            </Field>
            <Field label="Barkod / RFID">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ScanLine className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="Bileklik barkodu/RFID" className="w-full border rounded pl-8 pr-2 py-2 text-sm" value={form.barcode} onChange={(e)=>setForm(f=>({...f, barcode: e.target.value}))} />
                </div>
                <button className="px-2.5 py-2 text-xs rounded border bg-white hover:bg-gray-50" onClick={()=>{
                  if (form.barcode) setForm(f=>({...f, patient_id: f.patient_id || f.barcode}));
                }}>Uygula</button>
              </div>
            </Field>
            <Field label="Tedavi Türü">
              <input placeholder="Örn. Cerrahi, Günübirlik" className="w-full border rounded px-2 py-2 text-sm" value={form.treatment_type} onChange={(e)=>setForm(f=>({...f, treatment_type: e.target.value}))} />
            </Field>
            <Field label="Planlanan Ameliyat Zamanı">
              <input type="datetime-local" className="w-full border rounded px-2 py-2 text-sm" value={form.planned_start} onChange={(e)=>setForm(f=>({...f, planned_start: e.target.value}))} />
            </Field>
            <Field label="Ameliyat / Prosedür Kodu" className="md:col-span-2">
              <input placeholder="Örn. CPT/ICD-9/10" className="w-full border rounded px-2 py-2 text-sm" value={form.procedure_code} onChange={(e)=>setForm(f=>({...f, procedure_code: e.target.value}))} />
            </Field>
            <Field label="Anestezi Bilgisi" className="md:col-span-2">
              <div className="flex items-start gap-3">
                <label className="inline-flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" checked={form.anesthesia_required} onChange={(e)=>setForm(f=>({...f, anesthesia_required: e.target.checked}))} />
                  Anestezi Gerekiyor
                </label>
                <div className="flex-1 space-y-1">
                  <input placeholder="Örn. ASA, protokol vb. (gerekçe)" className={`w-full border rounded px-2 py-2 text-sm ${form.anesthesia_required && !form.anesthesia_notes?.trim() ? 'border-rose-300': ''}`} value={form.anesthesia_notes} onChange={(e)=>setForm(f=>({...f, anesthesia_notes: e.target.value}))} />
                  {form.anesthesia_required && !form.anesthesia_notes?.trim() && (
                    <div className="text-[11px] text-rose-600">Anestezi işaretliyken gerekçe girilmelidir.</div>
                  )}
                </div>
            </div>
            </Field>
            {approvalMode && (
              <Field label="İstem Gerekçesi" className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <input placeholder="Örn. klinik gereksinim" className="w-full border rounded px-2 py-2 text-sm" value={form.reason || ''} onChange={(e)=>setForm(f=>({...f, reason: e.target.value}))} />
                  <button className="text-xs underline" onClick={()=>{
                    const pending = admissionRequests.find(r=>r.status==='pending');
                    if (pending) updateAdmissionRequest(pending.request_id, { reason: form.reason || '' });
                  }}>Kaydet</button>
            </div>
              </Field>
            )}
            <Field label="Servis" className="md:col-span-2">
              <select className="w-full border rounded px-2 py-2 text-sm" value={form.ward_id} onChange={(e)=>setForm(f=>({...f, ward_id: e.target.value, room_id: '', bed_id: ''}))}>
                <option value="">Seçin</option>
                {wardOptions.map(w => <option key={w.ward_id} value={w.ward_id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Oda">
              <select className="w-full border rounded px-2 py-2 text-sm" value={form.room_id} onChange={(e)=>setForm(f=>({...f, room_id: e.target.value, bed_id: ''}))}>
                <option value="">Seçin</option>
                {roomOptions.map(r => <option key={r.room_id} value={r.room_id}>{r.name}</option>)}
              </select>
            </Field>
            <Field label="Yatak">
              <div className="mb-2 inline-flex gap-1 rounded border border-gray-200 p-1 bg-gray-50">
                {['vacant','occupied','reserved','cleaning','maintenance','all'].map(k => (
                  <button key={k} type="button" className={`px-2 py-1 text-xs rounded ${bedFilter===k? 'bg-white border border-gray-300':'bg-transparent text-gray-600'}`} onClick={()=>setBedFilter(k)}>
                    {k==='vacant'?'Boş':k==='occupied'?'Dolu':k==='reserved'?'Rezerve':k==='cleaning'?'Temizlik':k==='maintenance'?'Arıza':'Tümü'}
                  </button>
                ))}
            </div>
              <select className="w-full border rounded px-2 py-2 text-sm" value={form.bed_id} onChange={(e)=>setForm(f=>({...f, bed_id: e.target.value}))}>
                <option value="">Seçin</option>
                {filteredBedOptions.map(b => <option key={b.bed_id} value={b.bed_id}>{b.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded ${canAdmit && canAdmitPermission ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              disabled={!canAdmit || !canAdmitPermission}
              onClick={()=>{
                if (!canAdmit || !canAdmitPermission) return;
                if (approvalMode) {
                  requestAdmission({
                    request_id: crypto.randomUUID(),
                    patient_id: form.patient_id,
                    ward_id: form.ward_id,
                    room_id: form.room_id,
                    bed_id: form.bed_id,
                    attending_physician_id: form.attending_physician_id,
                    planned_start: form.planned_start || undefined,
                    procedure_code: form.procedure_code || undefined,
                    anesthesia_required: !!form.anesthesia_required,
                    anesthesia_notes: form.anesthesia_notes || undefined,
                    barcode: form.barcode || undefined,
                    created_by: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    reason: form.reason || undefined,
                    status: 'pending',
                  });
                  return;
                }
              admit({
                admission_id: crypto.randomUUID(),
                patient_id: form.patient_id,
                ward_id: form.ward_id,
                room_id: form.room_id,
                bed_id: form.bed_id,
                attending_physician_id: form.attending_physician_id,
                admit_time: new Date().toISOString(),
                status: 'admitted',
              });
              }}
            >
              <LogIn size={16} />
              Yatış Ver
            </button>
          </div>
        </SectionCard>
      )}

      {tab==='transfer' && (
        <TransferPanel />
      )}
      {tab==='discharge' && (
        <DischargePanel approvalMode={approvalMode} />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Servis" value={totalWards} icon={<Building2 size={16} />} />
        <StatCard title="Oda" value={totalRooms} icon={<LayoutGrid size={16} />} />
        <StatCard title="Boş Yatak" value={vacantBeds} icon={<BedDouble size={16} />} />
        <StatCard title="Dolu Yatak" value={occupiedBeds} icon={<BedDouble size={16} className="text-rose-500" />} />
      </div>

      <SectionCard title="Servis Doluluk Raporu" subtitle="Servis bazında boş/dolu/rezerve yatak sayıları">
        <ul className="text-sm grid md:grid-cols-2 gap-2">
          {wards.map(w => {
            const wardBeds = beds.filter(b=>b.ward_id===w.ward_id);
            const v = wardBeds.filter(b=>b.status==='vacant').length;
            const o = wardBeds.filter(b=>b.status==='occupied').length;
            const r = wardBeds.filter(b=>b.status==='reserved').length;
            return (
              <li key={w.ward_id} className="flex items-center justify-between rounded border p-2">
                <span className="font-medium">{w.name}</span>
                <span className="text-xs text-gray-600">Boş: {v} · Dolu: {o} · Rezerve: {r}</span>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Aktif Yatışlar" subtitle={`${admissions.length} kayıt`}>
          <ul className="text-sm space-y-2">
            {admissions.length === 0 && (
              <li className="text-gray-500">Kayıt yok.</li>
            )}
            {admissions.map(a => {
              const ward = wards.find(w=>w.ward_id===a.ward_id);
              const room = rooms.find(r=>r.room_id===a.room_id);
              const bed = beds.find(b=>b.bed_id===a.bed_id);
              return (
                <li key={a.admission_id} className="flex items-center justify-between rounded border p-2">
                  <div className="space-y-0.5">
                    <div className="font-medium">{a.patient_id}</div>
                    <div className="text-xs text-gray-600">{ward?.name || 'Servis'} · {room?.name || 'Oda'} · {bed?.label || 'Yatak'}</div>
                  </div>
                  <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-blue-50 text-blue-700">{a.status}</span>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Transferler" subtitle={`${transfers.length} kayıt`}>
          <ul className="text-sm space-y-2">
            {transfers.length === 0 && <li className="text-gray-500">Kayıt yok.</li>}
            {transfers.map(t => {
              const from = wards.find(w=>w.ward_id===t.from_ward_id)?.name || '—';
              const to = wards.find(w=>w.ward_id===t.to_ward_id)?.name || '—';
              return (
                <li key={t.transfer_id} className="flex items-center justify-between rounded border p-2">
                  <div>
                    <div className="font-medium">{t.admission_id.slice(0,8)}…</div>
                    <div className="text-xs text-gray-600">{from} → {to}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700">{new Date(t.ts).toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Taburcular" subtitle={`${discharges.length} kayıt`}>
          <ul className="text-sm space-y-2">
            {discharges.length === 0 && <li className="text-gray-500">Kayıt yok.</li>}
            {discharges.map(d => (
              <li key={d.discharge_id} className="flex items-center justify-between rounded border p-2">
                <div>
                  <div className="font-medium">{d.admission_id.slice(0,8)}…</div>
                  <div className="text-xs text-gray-600 truncate max-w-[160px]">{d.summary || 'Özet yok'}</div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{new Date(d.discharge_time).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="İlaç Uygulamaları" subtitle={form.patient_id ? `Hasta ${form.patient_id.slice(0,8)}…` : 'Hasta seçin'}>
        <EmarPanel patientId={form.patient_id} />
      </SectionCard>

      {approvalMode && (
        <div className="grid md:grid-cols-2 gap-4">
          <SectionCard title="Yatış İstemleri" subtitle={`${admissionRequests.length} bekleyen`}>
            <ul className="text-sm space-y-2">
              {admissionRequests.length === 0 && <li className="text-gray-500">Kayıt yok.</li>}
              {admissionRequests.map(r => (
                <li key={r.request_id} className="flex items-center justify-between rounded border p-2">
                  <div>
                    <div className="font-medium">{r.patient_id.slice(0,8)}…</div>
                    <div className="text-xs text-gray-600">{wards.find(w=>w.ward_id===r.ward_id)?.name} · {rooms.find(o=>o.room_id===r.room_id)?.name}</div>
                    <div className="text-[11px] text-gray-500">{r.planned_start ? new Date(r.planned_start).toLocaleString() : 'Plan yok'} · {r.procedure_code || 'Prosedür yok'} · {r.anesthesia_required ? 'Anestezi: Var' : 'Anestezi: Yok'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-emerald-600 text-white disabled:opacity-60" disabled={!hasPermission('admission:approve')} onClick={()=>{
                      if (!hasPermission('admission:approve')) return;
                      setModal({ type: 'admission-approve', id: r.request_id, reason: r.reason || '' });
                    }}>
                      <CheckCircle2 size={14} /> Onayla
                    </button>
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-rose-600 text-white disabled:opacity-60" disabled={!hasPermission('admission:approve')} onClick={()=>{
                      if (!hasPermission('admission:approve')) return;
                      setModal({ type: 'admission-reject', id: r.request_id, reason: r.reason || '' });
                    }}>
                      <XCircle size={14} /> Reddet
                    </button>
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border disabled:opacity-60" disabled={!hasPermission('admission:approve')} onClick={()=>expireAdmission(r.request_id)}>
                      <Timer size={14} /> Süre Aşımı
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Taburcu İstemleri" subtitle={`${dischargeRequests.length} bekleyen`}>
            <ul className="text-sm space-y-2">
              {dischargeRequests.length === 0 && <li className="text-gray-500">Kayıt yok.</li>}
              {dischargeRequests.map(r => (
                <li key={r.discharge_request_id} className="flex items-center justify-between rounded border p-2">
                  <div>
                    <div className="font-medium">{r.admission_id.slice(0,8)}…</div>
                    <div className="text-xs text-gray-600 truncate max-w-[200px]">{r.summary || 'Özet yok'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-emerald-600 text-white disabled:opacity-60" disabled={!hasPermission('admission:approve')} onClick={()=>{
                      if (!hasPermission('admission:approve')) return;
                      setModal({ type: 'discharge-approve', id: r.discharge_request_id, reason: r.reason || '', signed_by_name: r.signed_by_name || '', signed_by_id: r.signed_by_id || '' });
                    }}>
                      <CheckCircle2 size={14} /> Onayla
                    </button>
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-rose-600 text-white disabled:opacity-60" disabled={!hasPermission('admission:approve')} onClick={()=>{
                      if (!hasPermission('admission:approve')) return;
                      setModal({ type: 'discharge-reject', id: r.discharge_request_id, reason: r.reason || '' });
                    }}>
                      <XCircle size={14} /> Reddet
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {/* Approve/Reject Modal */}
      <Modal
        open={!!modal}
        title={modal?.type?.includes('admission') ? 'Yatış Onay/Red' : 'Taburcu Onay/Red'}
        onClose={()=>setModal(null)}
        footer={<>
          {modal?.type === 'admission-approve' && (
            <button disabled={!modal?.reason?.trim()} className={`text-sm px-3 py-1 rounded ${modal?.reason?.trim()? 'bg-emerald-600 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`} onClick={()=>{
              updateAdmissionRequest(modal.id, { reason: modal.reason || '' });
              approveAdmission(modal.id);
              setModal(null);
            }}>Onayla</button>
          )}
          {modal?.type === 'admission-reject' && (
            <button disabled={!modal?.reason?.trim()} className={`text-sm px-3 py-1 rounded ${modal?.reason?.trim()? 'bg-rose-600 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`} onClick={()=>{
              updateAdmissionRequest(modal.id, { reason: modal.reason || '' });
              rejectAdmission(modal.id);
              setModal(null);
            }}>Reddet</button>
          )}
          {modal?.type === 'discharge-approve' && (
            <button disabled={!modal?.reason?.trim() || !modal?.signed_by_name?.trim() || !modal?.signed_by_id?.trim()} className={`text-sm px-3 py-1 rounded ${modal?.reason?.trim() && modal?.signed_by_name?.trim() && modal?.signed_by_id?.trim()? 'bg-emerald-600 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`} onClick={()=>{
              updateDischargeRequest(modal.id, { reason: modal.reason || '', signed_by_name: modal.signed_by_name || '', signed_by_id: modal.signed_by_id || '' });
              approveDischarge(modal.id);
              setModal(null);
            }}>Onayla</button>
          )}
          {modal?.type === 'discharge-reject' && (
            <button disabled={!modal?.reason?.trim()} className={`text-sm px-3 py-1 rounded ${modal?.reason?.trim()? 'bg-rose-600 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`} onClick={()=>{
              updateDischargeRequest(modal.id, { reason: modal.reason || '' });
              rejectDischarge(modal.id);
              setModal(null);
            }}>Reddet</button>
          )}
        </>}
      >
        {modal?.type?.includes('admission') && (
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Gerekçe (zorunlu)</label>
            <input className="w-full border rounded px-2 py-2 text-sm" value={modal.reason || ''} onChange={(e)=>setModal(m=>({...m, reason: e.target.value}))} />
          </div>
        )}
        {modal?.type === 'discharge-reject' && (
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Gerekçe (zorunlu)</label>
            <input className="w-full border rounded px-2 py-2 text-sm" value={modal.reason || ''} onChange={(e)=>setModal(m=>({...m, reason: e.target.value}))} />
          </div>
        )}
        {modal?.type === 'discharge-approve' && (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Gerekçe (zorunlu)</label>
              <input className="w-full border rounded px-2 py-2 text-sm" value={modal.reason || ''} onChange={(e)=>setModal(m=>({...m, reason: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Onay İmza Ad-Soyad</label>
                <input className="w-full border rounded px-2 py-2 text-sm" value={modal.signed_by_name || ''} onChange={(e)=>setModal(m=>({...m, signed_by_name: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Onay İmza ID</label>
                <input className="w-full border rounded px-2 py-2 text-sm" value={modal.signed_by_id || ''} onChange={(e)=>setModal(m=>({...m, signed_by_id: e.target.value}))} />
        </div>
        </div>
      </div>
        )}
      </Modal>

      {/* Medication Administration modal */}
      <MedicationModal
        open={!!medModal}
        onClose={()=>setMedModal(null)}
        patientId={form.patient_id}
        patientBarcode={form.barcode}
      />

      {/* Errors detail modal */}
      <Modal open={errorsOpen} title="Sistem Hata Ayrıntıları" onClose={()=>setErrorsOpen(false)} footer={<></>}>
        <ul className="text-xs space-y-1">
          {errors.map((e,i)=>(
            <li key={i} className="rounded border p-2 bg-white">{e}</li>
          ))}
        </ul>
      </Modal>

      {/* Stock details modal */}
      <Modal open={stockDetailsOpen} title="Stok Uyarı Detayları" onClose={()=>setStockDetailsOpen(false)} footer={<></>}>
        <div className="text-xs space-y-3">
          <div>
            <div className="font-medium mb-1">Düşük Stok (≤3)</div>
            <ul className="space-y-1">
              {Object.entries(lowStock)
                .filter(([,q])=>q<=3)
                .map(([medication_id, q])=>{
                  const m = (pharmacy.medications||[]).find(mm=>mm.medication_id===medication_id);
                  return <li key={medication_id} className="rounded border p-2 bg-white flex items-center justify-between"><span>{m?.code || 'ILAC'} — {m?.name || ''}</span><span className="font-mono">{q}</span></li>
                })}
              {Object.entries(lowStock).filter(([,q])=>q<=3).length===0 && (
                <li className="text-gray-500">Kayıt yok.</li>
              )}
            </ul>
          </div>
          <div>
            <div className="font-medium mb-1">7 Gün İçinde SKT</div>
            <ul className="space-y-1">
              {(pharmacy.lots||[])
                .filter(l=> (new Date(l.expiry_date).getTime()-Date.now())<7*24*3600*1000)
                .sort((a,b)=> new Date(a.expiry_date).getTime()-new Date(b.expiry_date).getTime())
                .map(l=>{
                  const m = (pharmacy.medications||[]).find(mm=>mm.medication_id===l.medication_id);
                  return <li key={l.lot_id} className="rounded border p-2 bg-white flex items-center justify-between"><span>{m?.code || 'ILAC'} — Lot {l.lot_no}</span><span>{new Date(l.expiry_date).toLocaleDateString()}</span></li>
                })}
              {(pharmacy.lots||[]).filter(l=> (new Date(l.expiry_date).getTime()-Date.now())<7*24*3600*1000).length===0 && (
                <li className="text-gray-500">Kayıt yok.</li>
              )}
            </ul>
          </div>
        </div>
      </Modal>

      <AuditPanel />
    </div>
  );
}

function TransferPanel() {
  const { admissions, wards, rooms, beds, transfer } = useAdmissionStore();
  const [sel, setSel] = useState({ admission_id: '', ward_id: '', room_id: '', bed_id: '' });
  const roomOptions = useMemo(() => rooms.filter(r => r.ward_id === sel.ward_id), [rooms, sel.ward_id]);
  const bedOptions = useMemo(() => beds.filter(b => b.ward_id === sel.ward_id && b.room_id === sel.room_id), [beds, sel.ward_id, sel.room_id]);
  const canTransfer = !!(sel.admission_id && sel.ward_id && sel.room_id && sel.bed_id);
  const { hasPermission } = useRBAC();
  const canTransferPermission = hasPermission('admission:transfer');
  return (
    <SectionCard title="Yatış Transferi" subtitle="Yatışı farklı servis/oda/yatağa alın.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yatış" className="md:col-span-2">
          <select className="w-full border rounded px-2 py-2 text-sm" value={sel.admission_id} onChange={(e)=>setSel(s=>({...s, admission_id: e.target.value}))}>
            <option value="">Seçin</option>
            {admissions.map(a => (
              <option key={a.admission_id} value={a.admission_id}>{a.patient_id}</option>
            ))}
          </select>
        </Field>
        <Field label="Yeni Servis" className="md:col-span-2">
          <select className="w-full border rounded px-2 py-2 text-sm" value={sel.ward_id} onChange={(e)=>setSel(s=>({...s, ward_id: e.target.value, room_id: '', bed_id: ''}))}>
            <option value="">Seçin</option>
            {wards.map(w => <option key={w.ward_id} value={w.ward_id}>{w.name}</option>)}
          </select>
        </Field>
        <Field label="Yeni Oda">
          <select className="w-full border rounded px-2 py-2 text-sm" value={sel.room_id} onChange={(e)=>setSel(s=>({...s, room_id: e.target.value, bed_id: ''}))}>
            <option value="">Seçin</option>
            {roomOptions.map(r => <option key={r.room_id} value={r.room_id}>{r.name}</option>)}
          </select>
        </Field>
        <Field label="Yeni Yatak">
          <select className="w-full border rounded px-2 py-2 text-sm" value={sel.bed_id} onChange={(e)=>setSel(s=>({...s, bed_id: e.target.value}))}>
            <option value="">Seçin</option>
            {bedOptions.filter(b=>b.status==='vacant').map(b => <option key={b.bed_id} value={b.bed_id}>{b.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded ${canTransfer && canTransferPermission ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!canTransfer || !canTransferPermission}
          onClick={()=>{
            if (!canTransfer || !canTransferPermission) return;
          const a = admissions.find(x=>x.admission_id===sel.admission_id);
          if (!a) return;
          transfer({
            transfer_id: crypto.randomUUID(),
            admission_id: a.admission_id,
            from_ward_id: a.ward_id,
            from_room_id: a.room_id,
            from_bed_id: a.bed_id,
            to_ward_id: sel.ward_id,
            to_room_id: sel.room_id,
            to_bed_id: sel.bed_id,
            ts: new Date().toISOString(),
          });
          }}
        >
          <ArrowLeftRight size={16} />
          Transfer Et
        </button>
      </div>
    </SectionCard>
  );
}

function DischargePanel({ approvalMode = false }) {
  const { admissions, discharge, requestDischarge } = useAdmissionStore();
  const { hasPermission } = useRBAC();
  const [sel, setSel] = useState({ admission_id: '', summary: '', reason: '', signed_by_name: '', signed_by_id: '' });
  const canDischarge = !!sel.admission_id && (sel.summary?.trim().length > 0);
  const canDischargePermission = hasPermission('admission:discharge');
  return (
    <SectionCard title="Taburcu" subtitle="Taburcu olacak yatış seçin ve özet ekleyin.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yatış" className="md:col-span-2">
          <select className="w-full border rounded px-2 py-2 text-sm" value={sel.admission_id} onChange={(e)=>setSel(s=>({...s, admission_id: e.target.value}))}>
            <option value="">Seçin</option>
            {admissions.map(a => (
              <option key={a.admission_id} value={a.admission_id}>{a.patient_id}</option>
            ))}
          </select>
        </Field>
        <Field label="Özet (zorunlu)" className="md:col-span-2">
          <textarea className="w-full border rounded px-2 py-2 text-sm" rows={3} value={sel.summary} onChange={(e)=>setSel(s=>({...s, summary: e.target.value}))} />
        </Field>
        {approvalMode && (
          <Field label="Taburcu Gerekçesi" className="md:col-span-2">
            <div className="flex items-center gap-2">
              <input className="w-full border rounded px-2 py-2 text-sm" placeholder="Örn. klinik stabilizasyon" value={sel.reason} onChange={(e)=>setSel(s=>({...s, reason: e.target.value}))} />
              <button className="text-xs underline" onClick={()=>{
                const pending = (admissions.length>0 ? null : null); // placeholder to keep structure simple
              }}>Kaydet</button>
        </div>
          </Field>
        )}
        {approvalMode && (
          <>
            <Field label="Onay İmza Ad-Soyad" className="md:col-span-1">
              <input className="w-full border rounded px-2 py-2 text-sm" placeholder="Dr. Ad Soyad" value={sel.signed_by_name} onChange={(e)=>setSel(s=>({...s, signed_by_name: e.target.value}))} />
            </Field>
            <Field label="Onay İmza ID" className="md:col-span-1">
              <input className="w-full border rounded px-2 py-2 text-sm" placeholder="00000000-0000-0000-0000-000000000000" value={sel.signed_by_id} onChange={(e)=>setSel(s=>({...s, signed_by_id: e.target.value}))} />
            </Field>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded ${canDischarge && canDischargePermission ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!canDischarge || !canDischargePermission}
          onClick={()=>{
            if (!sel.admission_id || !sel.summary?.trim() || !canDischargePermission) return;
            if (approvalMode) {
              if (!sel.reason?.trim() || !sel.signed_by_name?.trim() || !sel.signed_by_id?.trim()) { alert('Gerekçe ve imza bilgileri zorunlu.'); return; }
              requestDischarge({
                discharge_request_id: crypto.randomUUID(),
                admission_id: sel.admission_id,
                summary: sel.summary || undefined,
                reason: sel.reason || undefined,
                signed_by_name: sel.signed_by_name || undefined,
                signed_by_id: sel.signed_by_id || undefined,
                created_by: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                status: 'pending',
              });
            } else {
              // Default immediate discharge
          discharge({
            discharge_id: crypto.randomUUID(),
            admission_id: sel.admission_id,
            decision_time: new Date().toISOString(),
            discharge_time: new Date().toISOString(),
            summary: sel.summary || undefined,
            signed_by: crypto.randomUUID(),
          });
            }
          }}
        >
          <LogOut size={16} />
          Taburcu Et
        </button>
      </div>
    </SectionCard>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
    >
      {icon}
      {children}
    </button>
  );
}

function SectionCard({ title, subtitle, children, className }) {
  return (
    <section className={`bg-white border rounded p-4 ${className || ''}`}>
      <header className="mb-3">
        <h2 className="font-medium">{title}</h2>
        {subtitle ? <p className="text-xs text-gray-600">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}

function Field({ label, children, className }) {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border rounded p-3 flex items-center gap-3">
      <div className="shrink-0 text-gray-600">{icon}</div>
      <div>
        <div className="text-xs text-gray-600">{title}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function AuditPanel() {
  const [query, setQuery] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [openIdx, setOpenIdx] = useState(null);
  const raw = getAuditLog();
  const startMs = start ? new Date(start).getTime() : null;
  const endMs = end ? new Date(end).getTime() : null;
  const filtered = raw.filter(e => {
    const okText = (e.action?.toLowerCase() || '').includes(query.toLowerCase());
    const ts = new Date(e.ts).getTime();
    const okStart = startMs == null || ts >= startMs;
    const okEnd = endMs == null || ts <= endMs;
    return okText && okStart && okEnd;
  });
  const entries = filtered.slice(-50).reverse();
  const exportCsv = () => {
    const headers = ['ts','action','entity','entity_id'];
    const lines = [headers.join(',')].concat(
      entries.map(e => [e.ts, e.action, e.entity, e.entity_id].map(v => '"' + String(v ?? '').replaceAll('"','""') + '"').join(','))
    );
    const csv = lines.join('\n');
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };
  const exportJson = () => {
    try {
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };
  return (
    <SectionCard title="İşlem Geçmişi" subtitle="Son 50 işlem – filtrelenebilir" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input className="min-w-[220px] border rounded px-2 py-1 text-sm" placeholder="Aksiyon ara (ör. admission, discharge)" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <input type="datetime-local" className="border rounded px-2 py-1 text-sm" value={start} onChange={(e)=>setStart(e.target.value)} />
        <input type="datetime-local" className="border rounded px-2 py-1 text-sm" value={end} onChange={(e)=>setEnd(e.target.value)} />
        <div className="ml-auto flex items-center gap-3">
          <button className="text-xs underline" onClick={exportCsv}>CSV Dışa Aktar</button>
          <button className="text-xs underline" onClick={exportJson}>JSON Dışa Aktar</button>
        </div>
      </div>
      <ul className="text-xs space-y-2">
        {entries.length === 0 && <li className="text-gray-500">Kayıt yok.</li>}
        {entries.map((e, idx) => (
          <li key={idx} className="rounded border p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{e.action}</span>
                <span className="text-gray-600">{e.entity}:{(e.entity_id||'').slice(0,8)}…</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{new Date(e.ts).toLocaleString()}</span>
                <button className="text-xs underline" onClick={()=>setOpenIdx(openIdx===idx? null: idx)}>{openIdx===idx? 'Gizle':'Detay'}</button>
              </div>
            </div>
            {openIdx===idx && (
              <pre className="mt-2 text-[11px] overflow-auto max-h-40 bg-gray-50 border rounded p-2">{JSON.stringify(e.delta ?? {}, null, 2)}</pre>
            )}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white border rounded shadow w-[min(90vw,520px)]">
        <div className="px-4 py-2 border-b font-medium">{title}</div>
        <div className="p-4 space-y-3">{children}</div>
        <div className="px-4 py-2 border-t flex items-center justify-end gap-2">
          {footer}
          <button className="text-sm px-3 py-1 rounded border" onClick={onClose}>Kapat</button>
        </div>
      </div>
    </div>
  );
}

function LinkButton({ href, label }) {
  return (
    <a className="text-xs underline" href={href}>{label}</a>
  );
}

function EmarPanel({ patientId }) {
  const pharmacy = usePharmacyStore();
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [res, setRes] = useState('all');
  const exportJson = () => {
    try {
      const payload = filtered.map(a => {
        const order = (pharmacy.orders||[]).find(o=>o.order_id===a.order_id);
        const med = (pharmacy.medications||[]).find(m=>m.medication_id===order?.medication_id);
        return { ts: a.administered_at, med_code: med?.code||'', dose: a.dose_given||'', result: a.result };
      });
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'emar.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };
  const all = (pharmacy.administrations || []).filter(a=>a.patient_id===patientId);
  const fromMs = from? new Date(from).getTime(): null;
  const toMs = to? new Date(to).getTime(): null;
  const filtered = all.filter(a=>{
    const order = (pharmacy.orders||[]).find(o=>o.order_id===a.order_id);
    const med = (pharmacy.medications||[]).find(m=>m.medication_id===order?.medication_id);
    const text = `${med?.code||''} ${a.dose_given||''}`.toLowerCase();
    const okText = !q || text.includes(q.toLowerCase());
    const ts = new Date(a.administered_at).getTime();
    const okFrom = fromMs==null || ts>=fromMs;
    const okTo = toMs==null || ts<=toMs;
    const okRes = res==='all' || a.result===res;
    return okText && okFrom && okTo && okRes;
  }).slice(-50).reverse();
  const exportCsv = () => {
    const headers = ['ts','med_code','dose','result'];
    const lines = [headers.join(',')].concat(
      filtered.map(a=>{
        const order = (pharmacy.orders||[]).find(o=>o.order_id===a.order_id);
        const med = (pharmacy.medications||[]).find(m=>m.medication_id===order?.medication_id);
        return [a.administered_at, med?.code||'', a.dose_given||'', a.result].map(v => '"' + String(v ?? '').replaceAll('"','""') + '"').join(',');
      })
    );
    const csv = lines.join('\n');
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'emar.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };
  if (!patientId) return <div className="text-gray-500 text-sm">Hasta seçilmedi.</div>;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input className="min-w-[200px] border rounded px-2 py-1 text-sm" placeholder="İlaç/dose ara" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input type="datetime-local" className="border rounded px-2 py-1 text-sm" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="datetime-local" className="border rounded px-2 py-1 text-sm" value={to} onChange={(e)=>setTo(e.target.value)} />
        <select className="border rounded px-2 py-1 text-sm" value={res} onChange={(e)=>setRes(e.target.value)}>
          <option value="all">Tümü</option>
          <option value="given">Uygulandı</option>
          <option value="held">Bekletildi</option>
          <option value="refused">Reddedildi</option>
          <option value="wasted">Atık</option>
        </select>
        <div className="ml-auto flex items-center gap-3">
          <button className="text-xs underline" onClick={exportCsv}>CSV</button>
          <button className="text-xs underline" onClick={exportJson}>JSON</button>
        </div>
      </div>
      <ul className="text-sm space-y-2">
        {filtered.length===0 && <li className="text-gray-500">Kayıt yok.</li>}
        {filtered.map(a=>{
          const order = (pharmacy.orders||[]).find(o=>o.order_id===a.order_id);
          const med = (pharmacy.medications||[]).find(m=>m.medication_id===order?.medication_id);
          return (
            <li key={a.admin_id} className="flex items-center justify-between rounded border p-2">
              <div className="space-y-0.5">
                <div className="font-medium">{med?.code || 'ILAC'} — {a.dose_given}</div>
                <div className="text-xs text-gray-600">{new Date(a.administered_at).toLocaleString()}</div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded ${a.result==='given'?'bg-emerald-50 text-emerald-700': a.result==='wasted'?'bg-rose-50 text-rose-700':'bg-gray-50 text-gray-600'}`}>{a.result}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MedicationModal({ open, onClose, patientId, patientBarcode }) {
  const { medications, lots, receiveStock, createOrder, administer, wasteFromStock } = usePharmacyStore();
  const [code, setCode] = useState('');
  const [dose, setDose] = useState('');
  const [wrist, setWrist] = useState('');
  const [cosign, setCosign] = useState('');
  const [result, setResult] = useState('given'); // given | held | refused | wasted
  const med = medications.find(m => m.code === code);
  const isControlled = !!med?.is_controlled;
  const canSubmit = !!patientId && !!med && !!dose && wrist && (wrist === patientId || (patientBarcode && wrist === patientBarcode)) && (!isControlled || !!cosign);
  if (!open) return null;
  return (
    <Modal open={open} title="İlaç Uygula" onClose={onClose} footer={
      <button className={`text-sm px-3 py-1 rounded ${canSubmit? 'bg-blue-600 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`} disabled={!canSubmit} onClick={()=>{
        const order = {
          order_id: crypto.randomUUID(),
          patient_id: patientId,
          medication_id: med.medication_id,
          dose,
          route: 'po',
          frequency: 'once',
          start_time: new Date().toISOString(),
          status: 'active',
        };
        createOrder(order);
        if (result === 'wasted') {
          // Deduct 1 unit from FEFO lot and record waste admin
          const medLots = lots.filter(l=>l.medication_id===med.medication_id).sort((a,b)=>new Date(a.expiry_date).getTime()-new Date(b.expiry_date).getTime());
          const selected = medLots[0];
          if (selected) {
            wasteFromStock(selected.lot_id, 1, 'waste', crypto.randomUUID());
            administer({ order_id: order.order_id, patient_id: patientId, lot_id: selected.lot_id, dose_given: dose, result: 'wasted', administered_at: new Date().toISOString(), administered_by: crypto.randomUUID(), cosigned_by: isControlled? cosign: undefined });
          }
        } else {
          administer({ order_id: order.order_id, patient_id: patientId, dose_given: dose, result, administered_at: new Date().toISOString(), administered_by: crypto.randomUUID(), cosigned_by: isControlled? cosign: undefined });
        }
        onClose();
      }}>Kaydet</button>
    }>
      <div className="space-y-3">
        <div className="text-xs text-gray-600">Hasta ID: <span className="font-mono">{patientId || '—'}</span></div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">İlaç Kodu</label>
            <input list="med-codes" className="w-full border rounded px-2 py-2 text-sm" placeholder="Örn. AMOX" value={code} onChange={(e)=>setCode(e.target.value.toUpperCase())} />
            <datalist id="med-codes">
              {medications.map(m=>(<option key={m.medication_id} value={m.code}>{m.name}</option>))}
            </datalist>
            {medications.length === 0 && (
              <button className="mt-2 text-xs underline" onClick={()=>{
                const medId = crypto.randomUUID();
                // Add demo medication and two FEFO lots
                usePharmacyStore.getState().addMedication({ medication_id: medId, code: 'AMOX', name: 'Amoxicillin', is_controlled: false });
                receiveStock({ lot_id: crypto.randomUUID(), medication_id: medId, lot_no: 'BATCH-B', expiry_date: new Date(Date.now() + 5*24*3600*1000).toISOString(), qty_on_hand: 5, location_code: 'MAIN' }, crypto.randomUUID());
                receiveStock({ lot_id: crypto.randomUUID(), medication_id: medId, lot_no: 'BATCH-A', expiry_date: new Date(Date.now() + 2*24*3600*1000).toISOString(), qty_on_hand: 5, location_code: 'MAIN' }, crypto.randomUUID());
                setCode('AMOX');
              }}>Demo stok yükle</button>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Doz</label>
            <input className="w-full border rounded px-2 py-2 text-sm" placeholder="Örn. 500 mg" value={dose} onChange={(e)=>setDose(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Sonuç</label>
            <select className="w-full border rounded px-2 py-2 text-sm" value={result} onChange={(e)=>setResult(e.target.value)}>
              <option value="given">Uygulandı</option>
              <option value="held">Bekletildi</option>
              <option value="refused">Reddedildi</option>
              <option value="wasted">Atık (Waste)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bileklik Barkodu Doğrulama</label>
            <input className={`w-full border rounded px-2 py-2 text-sm ${wrist && !(wrist === patientId || (patientBarcode && wrist === patientBarcode)) ? 'border-rose-300' : ''}`} placeholder="Hasta ID veya barkodu girin" value={wrist} onChange={(e)=>setWrist(e.target.value)} />
            {wrist && !(wrist === patientId || (patientBarcode && wrist === patientBarcode)) && (
              <div className="text-[11px] text-rose-600 mt-1">Barkod doğrulaması başarısız.</div>
            )}
          </div>
          {isControlled && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">Kontrollü İlaç - İkinci İmza ID</label>
              <input className="w-full border rounded px-2 py-2 text-sm" placeholder="00000000-0000-0000-0000-000000000000" value={cosign} onChange={(e)=>setCosign(e.target.value)} />
            </div>
          )}
          {!!lots.filter(l=>med && l.medication_id===med.medication_id).length && (
            <div className="text-xs text-gray-600">
              FEFO: {lots.filter(l=>med && l.medication_id===med.medication_id).sort((a,b)=>new Date(a.expiry_date).getTime()-new Date(b.expiry_date).getTime())[0]?.lot_no} önce kullanılacak.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

