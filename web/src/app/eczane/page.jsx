import { useState, useMemo } from 'react';
import { usePharmacyStore } from '@/stores/pharmacy';

function Section({ title, children, actions }) {
  return (
    <section className="bg-white border rounded p-4 space-y-3">
      <header className="flex items-center justify-between">
        <div className="font-medium">{title}</div>
        <div className="flex items-center gap-2">{actions}</div>
      </header>
      {children}
    </section>
  );
}

export default function EczanePage() {
  const { medications, lots, addMedication, receiveStock } = usePharmacyStore();
  const [showAddMed, setShowAddMed] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [medForm, setMedForm] = useState({ code: '', name: '', is_controlled: false });
  const [stockForm, setStockForm] = useState({ medication_id: '', lot_no: '', expiry_date: '', qty_on_hand: 0, location_code: 'MAIN' });
  const lowStockThreshold = 3;
  const [q, setQ] = useState('');
  const [barcode, setBarcode] = useState('');

  const inventory = useMemo(() => {
    const base = medications.map((m) => {
      const mLots = lots.filter((l) => l.medication_id === m.medication_id);
      const total = mLots.reduce((sum, l) => sum + (l.qty_on_hand || 0), 0);
      const earliest = mLots.length ? mLots.slice().sort((a,b)=>new Date(a.expiry_date).getTime()-new Date(b.expiry_date).getTime())[0] : null;
      const expiresSoon = earliest ? (new Date(earliest.expiry_date).getTime() - Date.now()) < 7*24*3600*1000 : false;
      return { med: m, total, earliest, expiresSoon };
    });
    const filtered = base.filter(row => {
      if (!q.trim()) return true;
      const text = `${row.med.code} ${row.med.name} ${row.earliest?.lot_no || ''}`.toLowerCase();
      return text.includes(q.toLowerCase());
    });
    return filtered.sort((a,b)=>a.med.code.localeCompare(b.med.code));
  }, [medications, lots, q]);

  const exportCsv = () => {
    const headers = ['code','name','controlled','total','earliest_lot','earliest_expiry'];
    const lines = [headers.join(',')].concat(
      inventory.map(row => [row.med.code, row.med.name, row.med.is_controlled ? 'yes' : 'no', row.total, row.earliest?.lot_no||'', row.earliest?.expiry_date||''].map(v => '"' + String(v ?? '').replaceAll('"','""') + '"').join(','))
    );
    const csv = lines.join('\n');
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };
  const exportJson = () => {
    try {
      const payload = inventory.map(r => ({
        code: r.med.code,
        name: r.med.name,
        is_controlled: !!r.med.is_controlled,
        total: r.total,
        earliest_lot: r.earliest?.lot_no || null,
        earliest_expiry: r.earliest?.expiry_date || null,
      }));
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Eczane / İlaç ve Stok</h1>
      <Section title="Formülary ve Stok" actions={<>
        <input className="hidden sm:block border rounded px-2 py-1 text-xs" placeholder="Ara (kod/ad/lot)" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input className="hidden sm:block border rounded px-2 py-1 text-xs" placeholder="Barkod Tara" value={barcode} onChange={(e)=>{ setBarcode(e.target.value); setQ(e.target.value); }} />
        <button className="text-xs underline" onClick={()=>setShowAddMed((v)=>!v)}>{showAddMed? 'İlaç Ekle (kapat)':'İlaç Ekle'}</button>
        <button className="text-xs underline" onClick={()=>setShowReceive((v)=>!v)}>{showReceive? 'Stok Girişi (kapat)':'Stok Girişi'}</button>
        <button className="text-xs underline" onClick={exportCsv}>CSV</button>
        <button className="text-xs underline" onClick={exportJson}>JSON</button>
      </>}>
        {showAddMed && (
          <div className="p-3 border rounded space-y-2">
            <div className="grid sm:grid-cols-3 gap-2">
              <input placeholder="Kod (örn. AMOX)" className="border rounded px-2 py-1 text-sm" value={medForm.code} onChange={(e)=>setMedForm(f=>({...f, code: e.target.value.toUpperCase()}))} />
              <input placeholder="Ad" className="border rounded px-2 py-1 text-sm" value={medForm.name} onChange={(e)=>setMedForm(f=>({...f, name: e.target.value}))} />
              <label className="text-xs inline-flex items-center gap-2"><input type="checkbox" checked={!!medForm.is_controlled} onChange={(e)=>setMedForm(f=>({...f, is_controlled: e.target.checked}))} /> Kontrollü</label>
            </div>
            <div className="flex justify-end">
              <button className="text-xs px-3 py-1 rounded bg-blue-600 text-white" onClick={()=>{
                if (!medForm.code.trim() || !medForm.name.trim()) return;
                addMedication({ medication_id: crypto.randomUUID(), code: medForm.code.trim().toUpperCase(), name: medForm.name.trim(), is_controlled: !!medForm.is_controlled });
                setMedForm({ code: '', name: '', is_controlled: false });
                setShowAddMed(false);
              }}>Kaydet</button>
            </div>
          </div>
        )}
        {showReceive && (
          <div className="p-3 border rounded space-y-2">
            <div className="grid sm:grid-cols-5 gap-2">
              <select className="border rounded px-2 py-1 text-sm" value={stockForm.medication_id} onChange={(e)=>setStockForm(f=>({...f, medication_id: e.target.value}))}>
                <option value="">İlaç seçin</option>
                {medications.map(m=> <option key={m.medication_id} value={m.medication_id}>{m.code} — {m.name}</option>)}
              </select>
              <input placeholder="Lot No" className="border rounded px-2 py-1 text-sm" value={stockForm.lot_no} onChange={(e)=>setStockForm(f=>({...f, lot_no: e.target.value}))} />
              <input type="date" className="border rounded px-2 py-1 text-sm" value={stockForm.expiry_date} onChange={(e)=>setStockForm(f=>({...f, expiry_date: e.target.value}))} />
              <input type="number" min="0" className="border rounded px-2 py-1 text-sm" placeholder="Miktar" value={stockForm.qty_on_hand} onChange={(e)=>setStockForm(f=>({...f, qty_on_hand: Number(e.target.value||0)}))} />
              <input placeholder="Konum" className="border rounded px-2 py-1 text-sm" value={stockForm.location_code} onChange={(e)=>setStockForm(f=>({...f, location_code: e.target.value}))} />
            </div>
            <div className="flex justify-end">
              <button className="text-xs px-3 py-1 rounded bg-blue-600 text-white" onClick={()=>{
                if (!stockForm.medication_id || !stockForm.lot_no.trim() || !stockForm.expiry_date || stockForm.qty_on_hand<=0) return;
                receiveStock({ lot_id: crypto.randomUUID(), medication_id: stockForm.medication_id, lot_no: stockForm.lot_no.trim(), expiry_date: stockForm.expiry_date, qty_on_hand: stockForm.qty_on_hand, location_code: stockForm.location_code || 'MAIN' }, crypto.randomUUID());
                setShowReceive(false);
                setStockForm({ medication_id: '', lot_no: '', expiry_date: '', qty_on_hand: 0, location_code: 'MAIN' });
              }}>Kaydet</button>
            </div>
          </div>
        )}

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-600">
                <th className="py-1 pr-2">Kod</th>
                <th className="py-1 pr-2">Ad</th>
                <th className="py-1 pr-2">Kontrollü</th>
                <th className="py-1 pr-2">Stok</th>
                <th className="py-1 pr-2">En Erken Lot</th>
                <th className="py-1 pr-2">SKT</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length===0 && (
                <tr><td colSpan={6} className="text-gray-500 py-2">Kayıt yok.</td></tr>
              )}
              {inventory.map(row => (
                <tr key={row.med.medication_id} className="border-t">
                  <td className="py-2 pr-2 font-mono">{row.med.code}</td>
                  <td className="py-2 pr-2">{row.med.name}</td>
                  <td className="py-2 pr-2">{row.med.is_controlled? 'Evet':'Hayır'}</td>
                  <td className={`py-2 pr-2 ${row.total<=lowStockThreshold? 'text-rose-600 font-medium':''}`}>{row.total}</td>
                  <td className="py-2 pr-2">{row.earliest?.lot_no || '—'}</td>
                  <td className={`py-2 pr-2 ${row.expiresSoon? 'text-amber-600 font-medium':''}`}>{row.earliest? new Date(row.earliest.expiry_date).toLocaleDateString(): '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}


