import { CheckCircle, Clock, XCircle, Plus, Search, Filter, MoreHorizontal, Edit } from "lucide-react";
import { memo } from "react";

function AmeliyatPlanlamaPage() {
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

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
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

              <div className="bg-white rounded-lg border border-gray-200 p-6">
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

              <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                  <button data-rbac-action="run:conflict-check" className="w-full h-9 px-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">Detaylı kontrol çalıştır</button>
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
            </div>

            <div className="col-span-8 space-y-6">
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
            </div>
          </div>
    </main>
  );
}

export default memo(AmeliyatPlanlamaPage);