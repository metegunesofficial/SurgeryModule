import { CheckCircle, XCircle, Clock, QrCode, Pause, RotateCcw, Timer, Search, Zap, Thermometer, Play, Package } from "lucide-react";
import { memo } from "react";

function SterilizasyonPage() {
  return (
    <main aria-labelledby="page-title">
      <h1 id="page-title" className="sr-only">Sterilizasyon Döngü Yönetimi</h1>
      <nav className="text-sm text-gray-500 mb-4">
        <span>Sterilizasyon</span>
        <span className="mx-2">›</span>
        <span>Döngü Yönetimi</span>
      </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Sterilizasyon Döngü Yönetimi</h1>
            <div className="flex gap-3">
              <button aria-label="QR Kod Tara" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                <QrCode className="w-4 h-4" />
                QR Kod Tara
              </button>
              <button data-rbac-action="create:sterilization-cycle" className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Play className="w-4 h-4" />
                Yeni Döngü Başlat
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-4 space-y-6">
              {/* Active Cycles */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Aktif Döngüler</h3>
                
                <div className="space-y-3">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Döngü #002</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Devam Ediyor</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>Autoclave #1</p>
                      <p>Başlangıç: 10:30</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">15 dk kaldı</span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      <p>Sıcaklık: 134°C | Basınç: 2.1 bar</p>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Döngü #003</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Hazırlık</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>Autoclave #2</p>
                      <p>Tahmini Başlangıç: 11:45</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Bekliyor</span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      <p>18 Adet Cerrahi Alet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Cihaz Durumu</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <div>
                        <p className="font-medium text-gray-900">Autoclave #1</p>
                        <p className="text-xs text-gray-500">Son Bakım: 5 Ağu 2025</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <p>Aktif</p>
                      <p>99.8% Başarı</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <div>
                        <p className="font-medium text-gray-900">Autoclave #2</p>
                        <p className="text-xs text-gray-500">Son Bakım: 3 Ağu 2025</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <p>Beklemede</p>
                      <p>99.5% Başarı</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <div>
                        <p className="font-medium text-gray-900">Ultrasonic #1</p>
                        <p className="text-xs text-gray-500">Son Bakım: 1 Ağu 2025</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <p>Bakım Gerekli</p>
                      <p>Planlanan: 12 Ağu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Control Tests */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Kalite Kontrol Testleri</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bowie-Dick Testi</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500">Bugün</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Spor Testi</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500">Dün</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Steam Penetration</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-gray-500">Planlı</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Leak Test</span>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-gray-500">Hata</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
                  Tüm Testleri Görüntüle
                </button>
              </div>

              {/* World-class sterilization module: Instrument Set Preparation */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Alet Seti Hazırlığı</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 rounded border border-gray-200">
                    <span>İmplant Seti</span>
                    <span className="text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">Tam</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded border border-gray-200">
                    <span>Endodonti Seti</span>
                    <span className="text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-0.5">Eksik</span>
                  </div>
                </div>
              </div>

              {/* World-class sterilization module: Traceability */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">İzlenebilirlik</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="p-3 rounded border border-gray-200">
                    QR &gt; Yükleme &gt; Döngü &gt; Boşaltma &gt; Depolama &gt; Kullanım &gt; Dezenfeksiyon
                  </div>
                  <button className="w-full h-9 px-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">Zinciri görüntüle</button>
                </div>
              </div>

              {/* Quality Assurance Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Kalite Güvence Metrikleri</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Biolojik Göstergeler</div>
                    <div className="mt-1 font-medium text-gray-900">%100 geçiş</div>
                    <div className="text-xs text-gray-500">AAMI ST79 referansı</div>
                  </div>
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Kimyasal Göstergeler</div>
                    <div className="mt-1 font-medium text-gray-900">Tip 5/6 tamam</div>
                    <div className="text-xs text-gray-500">ISO 11140-1 referansı</div>
                  </div>
                  <div className="p-3 rounded border border-gray-200">
                    <div className="text-gray-500">Döngü Başarı Oranı</div>
                    <div className="mt-1 font-medium text-gray-900">%99.6</div>
                    <div className="text-xs text-gray-500">Son 30 gün</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-8 space-y-6">
              {/* Sterilization Process Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Sterilizasyon Süreci</h2>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Pause className="w-4 h-4" />
                      Duraklat
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50">
                      <RotateCcw className="w-4 h-4" />
                      Döngüyü Sıfırla
                    </button>
                  </div>
                </div>

                {/* Process Flow */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ön Temizlik</p>
                        <p className="text-sm text-gray-500">Tamamlandı - 09:15</p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">✓ 5 dakika</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Yükleme ve Paketleme</p>
                        <p className="text-sm text-gray-500">Tamamlandı - 09:45</p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">✓ 30 dakika</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Timer className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Sterilizasyon Döngüsü</p>
                        <p className="text-sm text-gray-500">Devam Ediyor - 10:30</p>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600">⏱ 30/45 dakika</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">Soğuma ve Kurutma</p>
                        <p className="text-sm text-gray-400">Bekliyor</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">⌛ 15 dakika</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">Depolama</p>
                        <p className="text-sm text-gray-400">Bekliyor</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">⌛ 5 dakika</div>
                  </div>
                </div>

                {/* Real-time Parameters */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-900">Sıcaklık</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">134°C</p>
                    <p className="text-xs text-red-600">Hedef: 134°C</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">Basınç</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">2.1 bar</p>
                    <p className="text-xs text-blue-600">Hedef: 2.0-2.2 bar</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Süre</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">30/45</p>
                    <p className="text-xs text-green-600">dakika</p>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>Temperature/Pressure Over Time</span>
                    <span>Son 45 dakika</span>
                  </div>
                  
                  <div className="flex items-end justify-between h-40 gap-1">
                    {Array.from({length: 45}, (_, i) => {
                      // Simulate sterilization cycle temperature curve
                      const temp = i < 10 ? 20 + (i * 11.4) : // heating up
                                  i < 35 ? 134 : // holding at 134°C
                                  134 - ((i - 35) * 5); // cooling down
                      const pressure = i < 10 ? 0 + (i * 0.21) : // pressure building
                                      i < 35 ? 2.1 : // holding pressure
                                      2.1 - ((i - 35) * 0.1); // pressure release
                      
                      const tempHeight = Math.max(5, (temp / 140) * 80);
                      const pressureHeight = Math.max(5, (pressure / 3) * 80);
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                          <div 
                            className="w-full bg-red-400 rounded-sm"
                            style={{ height: `${tempHeight}%` }}
                          ></div>
                          <div 
                            className="w-full bg-blue-400 rounded-sm"
                            style={{ height: `${pressureHeight}%` }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Current Status Indicator */}
                  <div className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-lg text-xs">
                    <div>Döngü #002</div>
                    <div>Sterilizasyon Fazı</div>
                    <div>15 dk kalan süre</div>
                  </div>

                  <div className="flex gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded"></div>
                      <span>Sıcaklık (°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded"></div>
                      <span>Basınç (bar)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Cycles */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Son Döngüler</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Döngü ara..."
                        aria-label="Döngü ara"
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Döngü ID</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Cihaz</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Başlangıç</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Süre</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Malzeme</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Operatör</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-3 font-medium text-blue-600">#002</td>
                        <td className="py-3 px-3 text-sm text-gray-600">Autoclave #1</td>
                        <td className="py-3 px-3 text-sm text-gray-600">10:30</td>
                        <td className="py-3 px-3 text-sm text-gray-600">45 dk</td>
                        <td className="py-3 px-3 text-sm text-gray-600">24 Cerrahi Alet</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Devam Ediyor
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Hemşire Ayşe</td>
                      </tr>
                      
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-3 font-medium text-gray-900">#001</td>
                        <td className="py-3 px-3 text-sm text-gray-600">Autoclave #2</td>
                        <td className="py-3 px-3 text-sm text-gray-600">08:15</td>
                        <td className="py-3 px-3 text-sm text-gray-600">50 dk</td>
                        <td className="py-3 px-3 text-sm text-gray-600">18 Cerrahi Alet</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            Tamamlandı
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Teknisyen Mehmet</td>
                      </tr>

                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-3 font-medium text-gray-900">#000</td>
                        <td className="py-3 px-3 text-sm text-gray-600">Autoclave #1</td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dün 16:30</td>
                        <td className="py-3 px-3 text-sm text-gray-600">45 dk</td>
                        <td className="py-3 px-3 text-sm text-gray-600">32 Cerrahi Alet</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            Tamamlandı
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Hemşire Zeynep</td>
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

export default memo(SterilizasyonPage);