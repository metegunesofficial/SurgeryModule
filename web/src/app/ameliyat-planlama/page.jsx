import { CheckCircle, Clock, XCircle, Plus, Search, Filter, MoreHorizontal, Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { useSurgeryPlanningStore } from "@/stores/surgeryPlanning";
import { MockNotificationProvider } from "@/lib/providers/notifications/mock";
import { memo } from "react";

function AmeliyatPlanlamaPage() {
  const addBlock = useSurgeryPlanningStore((s) => s.addBlock);
  const verifyKits = useSurgeryPlanningStore((s) => s.verifyKits);
  const setResponsibility = useSurgeryPlanningStore((s) => s.setResponsibility);
  const [kitInput, setKitInput] = useState("");
  const kits = useMemo(() => kitInput.split(/\s*,\s*/).filter(Boolean), [kitInput]);
  const kitValidation = useMemo(() => verifyKits({ scanned_kit_ids: kits }), [kits, verifyKits]);

  // Block planning form
  const [blockForm, setBlockForm] = useState({ room_id: "Room-1", surgeon_id: "", day_of_week: "Mon", start_hour: 9, end_hour: 12 });

  // Responsibility matrix quick assign
  const [leadSurgeon, setLeadSurgeon] = useState("");
  const [anesthetist, setAnesthetist] = useState("");

  return (
    <main aria-labelledby="page-title">
          <h1 id="page-title" className="sr-only">Ameliyat Planlama</h1>
          {/* Başlık ve breadcrumb kaldırıldı */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filtrele
              </button>
              <button data-rbac-action="create:surgery-schedule" className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Yeni Ameliyat Planla
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-1">
            <div className="col-span-12 lg:col-span-4 space-y-6">
            
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Bugünün Programı</h3>
                  <span className="text-sm text-gray-500">11 Ağustos 2025</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0">
                  <div className="w-2 h-8 bg-blue-600 rounded" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">İmplant Cerrahisi</p>
                      <p className="text-sm text-gray-600">Dr. Atilla - Hasta: Ahmet Y.</p>
                      <p className="text-xs text-gray-500">09:00 - 11:30 (150 dk)</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0">
                  <div className="w-2 h-8 bg-blue-500 rounded" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Diş Çekimi</p>
                      <p className="text-sm text-gray-600">Dr. Mehmet - Hasta: Zeynep K.</p>
                      <p className="text-xs text-gray-500">14:00 - 14:45 (45 dk)</p>
                    </div>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                  <div className="w-2 h-8 bg-gray-300 rounded" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Kanal Tedavisi</p>
                      <p className="text-sm text-gray-600">Dr. Ayşe - Hasta: Emre D.</p>
                      <p className="text-xs text-gray-500">16:00 - 17:30 (90 dk)</p>
                    </div>
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Ameliyathane Durumu</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm font-medium text-gray-900">Ameliyathane 1</span>
                    </div>
                <div className="text-xs text-gray-500 text-right">
                      <span>Kullanımda</span>
                      <br />
                      <span>Bitiş: 11:30</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-gray-400 rounded-full" />
                      <span className="text-sm font-medium text-gray-900">Ameliyathane 2</span>
                    </div>
                <div className="text-xs text-gray-500 text-right">
                      <span>Sterilizasyon</span>
                      <br />
                      <span>Hazır: 13:00</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-gray-400 rounded-full" />
                      <span className="text-sm font-medium text-gray-900">Ameliyathane 3</span>
                    </div>
                <div className="text-xs text-gray-500 text-right">
                      <span>Müsait</span>
                      <br />
                      <span>Hazır</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Ameliyat Öncesi Kontrol</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Hasta kimlik kontrolü</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Anestezi onayı alındı</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Cerrahi alan işaretlendi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Sterilizasyon kontrolü</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Ameliyathane hazırlığı</span>
                  </div>
                </div>
              </div>

              {/* SKS/JCI: WHO Surgical Safety Checklist */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Cerrahi Güvenlik Kontrol Listesi</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Sign-in</div>
                    <div className="mt-1 font-medium text-gray-900">Kimlik/Onam doğrulandı</div>
                  </div>
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Time-out</div>
                    <div className="mt-1 font-medium text-gray-900">Takım onayı tamam</div>
                  </div>
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Sign-out</div>
                    <div className="mt-1 font-medium text-gray-900">Numuneler etiketli</div>
                  </div>
                </div>
              </div>

              {/* World-class surgery module: Resource Utilization */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Kaynak Kullanımı</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Ameliyathane</div>
                    <div className="mt-1 font-medium text-gray-900">%78 doluluk</div>
                  </div>
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Ekipman</div>
                    <div className="mt-1 font-medium text-gray-900">%85 kullanılabilir</div>
                  </div>
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Personel</div>
                    <div className="mt-1 font-medium text-gray-900">Tam kadro</div>
                  </div>
                </div>
              </div>

              {/* World-class surgery module: Conflict Detection */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Konflikt Tespiti</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between p-3 rounded border border-blue-200 bg-blue-50">
                    <span>Bugün çakışma bulunamadı</span>
                    <span className="text-xs text-blue-700">0 çakışma</span>
                  </div>
                  <button
                    data-rbac-action="run:conflict-check"
                    className="w-full h-9 px-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                      addBlock({
                        plan_id: crypto.randomUUID(),
                        room_id: "Room-1",
                        surgeon_id: crypto.randomUUID(),
                        day_of_week: "Mon",
                        start_hour: 9,
                        end_hour: 12,
                      });
                    }}
                  >
                    Detaylı kontrol çalıştır
                  </button>
                </div>
              </div>

              {/* World-class surgery module: Anesthesia Readiness */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Anestezi Hazırlığı</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded border border-blue-200 bg-blue-50">
                    <span className="text-gray-900">ASA sınıflaması</span>
                    <span className="text-blue-700 text-xs">Tamamlandı</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded border border-blue-200 bg-blue-50">
                    <span className="text-gray-900">Bilgilendirilmiş onam</span>
                    <span className="text-blue-700 text-xs">Hazır</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded border border-gray-200 bg-gray-50">
                    <span className="text-gray-900">Preop değerlendirme</span>
                    <span className="text-gray-700 text-xs">Devam ediyor</span>
                  </div>
                </div>
              </div>

              {/* PRD: Blok planlama UI iskeleti */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Blok Planlama</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="block text-gray-600 mb-1">Oda</label>
                    <input value={blockForm.room_id} onChange={(e)=>setBlockForm(f=>({...f, room_id: e.target.value}))} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Cerrah ID</label>
                    <input value={blockForm.surgeon_id} onChange={(e)=>setBlockForm(f=>({...f, surgeon_id: e.target.value}))} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Gün</label>
                    <select value={blockForm.day_of_week} onChange={(e)=>setBlockForm(f=>({...f, day_of_week: e.target.value}))} className="w-full border border-gray-300 rounded-md px-2 py-1">
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d)=> <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-gray-600 mb-1">Başlangıç</label>
                      <input type="number" min={0} max={23} value={blockForm.start_hour} onChange={(e)=>setBlockForm(f=>({...f, start_hour: Number(e.target.value)}))} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-600 mb-1">Bitiş</label>
                      <input type="number" min={1} max={24} value={blockForm.end_hour} onChange={(e)=>setBlockForm(f=>({...f, end_hour: Number(e.target.value)}))} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                    </div>
                  </div>
                </div>
                <button
                  className="mt-3 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={()=>{
                    addBlock({
                      plan_id: crypto.randomUUID(),
                      room_id: blockForm.room_id,
                      surgeon_id: blockForm.surgeon_id || crypto.randomUUID(),
                      day_of_week: blockForm.day_of_week,
                      start_hour: blockForm.start_hour,
                      end_hour: blockForm.end_hour,
                    });
                  }}
                >Kaydet</button>
              </div>

              {/* PRD: Kit doğrulama skeleton */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Kit Doğrulama</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    value={kitInput}
                    onChange={(e) => setKitInput(e.target.value)}
                    placeholder="Kit ID'leri virgülle girin"
                    className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                    aria-label="Kit ID'leri"
                  />
                </div>
                <div className="text-xs text-gray-700">
                  <span className={kitValidation.all_kits_valid ? "text-green-700" : "text-red-700"}>
                    {kitValidation.all_kits_valid ? "Tümü geçerli" : "Hatalı/tekrarlı ID"}
                  </span>
                </div>
              </div>

              {/* PRD: Ekip ataması sorumluluk matrisi */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Ekip Ataması</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="block text-gray-600 mb-1">Lead Surgeon (user_id)</label>
                    <input value={leadSurgeon} onChange={(e)=>setLeadSurgeon(e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Anestezist (user_id)</label>
                    <input value={anesthetist} onChange={(e)=>setAnesthetist(e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                </div>
                <button
                  className="mt-3 px-3 py-1 text-sm text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
                  onClick={()=>{
                    setResponsibility({
                      context: 'case',
                      case_id: crypto.randomUUID(),
                      assignments: [
                        { role: 'lead_surgeon', user_id: leadSurgeon || crypto.randomUUID() },
                        { role: 'anesthetist', user_id: anesthetist || crypto.randomUUID() },
                      ],
                    });
                  }}
                >Matrisi Kaydet</button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Haftalık Planlama</h2>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-gray-500 hover:text-gray-700">← Önceki Hafta</button>
                    <span className="text-sm font-medium text-gray-900">5-11 Ağustos 2025</span>
                    <button className="text-sm text-gray-500 hover:text-gray-700">Sonraki Hafta →</button>
                    <span
                      aria-label="Hazırlık Durumları"
                      className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                    >
                      Hazırlık Durumları
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                    <div key={day} className="p-2 text-center">
                      <div className="text-xs font-medium text-gray-500">{day}</div>
                  <div className={`text-sm font-medium mt-1 ${index === 6 ? 'text-blue-600' : 'text-gray-900'}`}>{5 + index}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    [{ time: '09:00', type: 'implant', doctor: 'Dr. Atilla' }, { time: '14:00', type: 'extraction', doctor: 'Dr. Mehmet' }],
                    [{ time: '10:00', type: 'root-canal', doctor: 'Dr. Ayşe' }],
                    [{ time: '09:30', type: 'implant', doctor: 'Dr. Atilla' }, { time: '15:00', type: 'cleaning', doctor: 'Dr. Mehmet' }],
                    [],
                    [{ time: '11:00', type: 'extraction', doctor: 'Dr. Ayşe' }, { time: '16:00', type: 'root-canal', doctor: 'Dr. Atilla' }],
                    [{ time: '09:00', type: 'implant', doctor: 'Dr. Mehmet' }],
                    []
                  ].map((daySchedule, dayIndex) => (
                    <div key={dayIndex} className="min-h-24 p-1">
                      {daySchedule.map((surgery, surgeryIndex) => (
                    <div key={surgeryIndex} className={`p-1 mb-1 rounded text-xs ${
                            surgery.type === 'implant' ? 'bg-blue-100 text-blue-700' :
                            surgery.type === 'extraction' ? 'bg-blue-50 text-blue-700' :
                            surgery.type === 'root-canal' ? 'bg-blue-200 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                    }`}>
                          <div className="font-medium">{surgery.time}</div>
                          <div className="truncate">{surgery.doctor}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 rounded" />
                    <span>İmplant</span>
                  </div>
                  <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-50 rounded" />
                    <span>Çekim</span>
                  </div>
                  <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-200 rounded" />
                    <span>Kanal</span>
                  </div>
                  <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-100 rounded" />
                    <span>Temizlik</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yaklaşan Ameliyatlar</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Hasta ara..."
                        aria-label="Hasta ara"
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Hasta</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Ameliyat</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Doktor</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Tarih/Saat</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Oda</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium text-gray-900">Ahmet Yılmaz</p>
                            <p className="text-sm text-gray-500">ID: 12345</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">İmplant Cerrahisi</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dr. Atilla</td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-900">11 Ağu, 09:00</div>
                          <div className="text-xs text-gray-500">150 dakika</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Oda 1</td>
                        <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">Devam Ediyor</span>
                        </td>
                        <td className="py-3 px-3">
                          <button aria-label="Daha fazla işlem" className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium text-gray-900">Zeynep Kaya</p>
                            <p className="text-sm text-gray-500">ID: 12346</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">Diş Çekimi</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dr. Mehmet</td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-900">11 Ağu, 14:00</div>
                          <div className="text-xs text-gray-500">45 dakika</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Oda 2</td>
                        <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Bekliyor</span>
                        </td>
                        <td className="py-3 px-3">
                          <button aria-label="Düzenle" className="text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium text-gray-900">Emre Demir</p>
                            <p className="text-sm text-gray-500">ID: 12347</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-700">Kanal Tedavisi</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dr. Ayşe</td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-900">11 Ağu, 16:00</div>
                          <div className="text-xs text-gray-500">90 dakika</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Oda 3</td>
                        <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Planlandı</span>
                        </td>
                        <td className="py-3 px-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PRD: Onay ve hatırlatma akışı mock */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Onay/Hatırlatma</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={async () => {
                        await MockNotificationProvider.sendApproval({
                          caseId: crypto.randomUUID(),
                          patientId: crypto.randomUUID(),
                          scheduledAtIso: new Date().toISOString(),
                          recipient: "+905551112233",
                          channel: "sms",
                        });
                      }}
                    >
                      Onay Gönder (SMS)
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
                      onClick={async () => {
                        await MockNotificationProvider.sendReminder({
                          caseId: crypto.randomUUID(),
                          recipient: "patient@example.com",
                          channel: "email",
                          remindAtIso: new Date(Date.now() + 3600_000).toISOString(),
                        });
                      }}
                    >
                      Hatırlatma Planla (E-posta)
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Bu butonlar mock sağlayıcıyı kullanır, gerçek entegrasyon içermez.</p>
              </div>

              {/* PRD: Materyal kullanımı kayıt formu */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Materyal Kullanımı</h2>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <input placeholder="Ürün Kodu" className="border border-gray-300 rounded-md px-2 py-1" />
                  <input placeholder="Lot No" className="border border-gray-300 rounded-md px-2 py-1" />
                  <input placeholder="Adet" type="number" className="border border-gray-300 rounded-md px-2 py-1" />
                  <input placeholder="UDI" className="border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <button className="mt-3 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Kaydet</button>
              </div>

              {/* PRD: Olay bildirimi formu */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Olay Bildirimi</h2>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <input placeholder="Olay Türü" className="border border-gray-300 rounded-md px-2 py-1" />
                  <select className="border border-gray-300 rounded-md px-2 py-1" aria-label="Şiddet">
                    <option value="low">Düşük</option>
                    <option value="med">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                  <input placeholder="Açıklama" className="border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <button className="mt-3 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Gönder</button>
              </div>

              {/* PRD: Audit log arayüzü */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2">Zaman</th>
                        <th className="text-left py-2 px-2">Aktör</th>
                        <th className="text-left py-2 px-2">Aksiyon</th>
                        <th className="text-left py-2 px-2">Varlık</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2">{new Date().toLocaleString()}</td>
                        <td className="py-2 px-2">user-123</td>
                        <td className="py-2 px-2">create:surgery-schedule</td>
                        <td className="py-2 px-2">case: CASE-1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
    </main>
  );
}

export default memo(AmeliyatPlanlamaPage);