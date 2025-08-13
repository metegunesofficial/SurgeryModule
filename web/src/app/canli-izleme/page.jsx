import {
  Wifi,
  Video,
  Camera,
  CheckCircle,
  Activity,
  Clock,
  Maximize,
  Settings,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";

export default function CanliIzlemePage() {
  return (
    <>
      {/* Başlık ve breadcrumb kaldırıldı */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            <Camera className="w-4 h-4" />
            Anlık Görüntü Al
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
            <Video className="w-4 h-4" />
            Kayıt Başlat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-6">
          {/* SKS/JCI: Aseptic & Access & Hand Hygiene */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Aseptik Alan Uyarıları</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Alan sınırları ihlali: Yok</p>
              <p>Temiz-kirli yön: Uygun</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Kapı Erişimi ve Hareket</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Son 60 dk kapı açılma sayısı: 12</p>
              <p>Limit: ≤ 20/saat</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">El Hijyeni ve Temas Süreleri</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Anlık uyum: %92</p>
              <p>Ortalama temas süresi: 3.2 dk</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Çevresel Parametreler</h3>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">Aktif</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-900">Sıcaklık</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Normal</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600">22.4°C</span>
                  <span className="text-sm text-gray-500">Hedef: 20-22°C</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Son 30 dk: Min 22.1°C, Max 22.6°C</div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">Nem Oranı</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Normal</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-600">45.2%</span>
                  <span className="text-sm text-gray-500">Hedef: 40-60%</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Son 30 dk: Min 44.8%, Max 45.9%</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">Hava Basıncı</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Normal</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">+15.2 Pa</span>
                  <span className="text-sm text-gray-500">Pozitif Basınç</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">HEPA filtrasyon aktif</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900">Hava Değişimi</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Normal</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-600">22</span>
                  <span className="text-sm text-gray-500">değişim/saat</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Minimum gereksinim: 20/saat</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Ameliyathane Durumu</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-gray-900">Ameliyathane 1</p>
                    <p className="text-xs text-gray-500">İmplant Cerrahisi - Dr. Atilla</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <p>Aktif</p>
                  <p>09:00 - 11:30</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Ameliyathane 2</p>
                    <p className="text-xs text-gray-500">Sterilizasyon Süreci</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <p>Hazırlanıyor</p>
                  <p>Hazır: 13:00</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Ameliyathane 3</p>
                    <p className="text-xs text-gray-500">Beklemede</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <p>Müsait</p>
                  <p>Hazır</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Anlık Uyarılar</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Tüm Parametreler Normal</p>
                  <p className="text-xs text-green-700 mt-1">Ameliyathane 1 - Çevre koşulları optimal</p>
                  <p className="text-xs text-green-600 mt-1">2 dakika önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">HVAC Sistemi Normal</p>
                  <p className="text-xs text-blue-700 mt-1">Hava filtrasyon sistemi optimal çalışıyor</p>
                  <p className="text-xs text-blue-600 mt-1">5 dakika önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ameliyat Planı Güncel</p>
                  <p className="text-xs text-gray-600 mt-1">Günlük program takvimde güncellendi</p>
                  <p className="text-xs text-gray-500 mt-1">15 dakika önce</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Ameliyathane 1 - Canlı Görüntü</h2>
                <div className="flex items-center gap-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>CANLI</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Maximize className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Canlı Görüntü</p>
                  <p className="text-sm opacity-75">Ameliyathane 1 - Güvenli Bağlantı</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-4">
                <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">11 Ağu 2025 - 10:45:32</div>
                <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">HD 1080p</div>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>KAYIT</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white p-3 rounded">
                <p className="font-medium">Hasta: Ahmet Yılmaz (ID: 12345)</p>
                <p className="text-sm opacity-90">İşlem: İmplant Cerrahisi</p>
                <p className="text-sm opacity-90">Doktor: Dr. Atilla</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="opacity-75">Nabız</p>
                    <p className="font-medium text-green-400">72 bpm</p>
                  </div>
                  <div>
                    <p className="opacity-75">SpO2</p>
                    <p className="font-medium text-green-400">98%</p>
                  </div>
                  <div>
                    <p className="opacity-75">Tansiyon</p>
                    <p className="font-medium text-green-400">120/80</p>
                  </div>
                  <div>
                    <p className="opacity-75">Sıcaklık</p>
                    <p className="font-medium text-green-400">36.8°C</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <Camera className="w-4 h-4" />
                  Kamera 1
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Kamera 2</button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Kamera 3</button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Bağlantı Güçlü</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Çevresel Parametre Geçmişi</h2>
              <div className="flex gap-2">
                <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md">Son 1 Saat</button>
                <button className="text-sm text-white bg-blue-600 px-3 py-1 rounded-md">Son 4 Saat</button>
                <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md">Bugün</button>
              </div>
            </div>
            <div className="relative h-64 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Sıcaklık, Nem ve Basınç Değerleri</span>
                <span>Son 4 Saat</span>
              </div>
              <div className="flex items-end justify-between h-40 gap-1">
                {Array.from({ length: 48 }, (_, i) => {
                  const temp = 21.5 + Math.sin(i * 0.3) * 0.8 + (Math.random() - 0.5) * 0.3;
                  const humidity = 45 + Math.sin(i * 0.2) * 3 + (Math.random() - 0.5) * 2;
                  const pressure = 15 + Math.sin(i * 0.1) * 2 + (Math.random() - 0.5) * 1;
                  const tempHeight = ((temp - 20) / 4) * 80;
                  const humidityHeight = ((humidity - 40) / 20) * 80;
                  const pressureHeight = (pressure / 20) * 80;
                  return (
                    <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                      <div className="w-full bg-red-400 rounded-sm" style={{ height: `${Math.max(5, tempHeight)}%` }} />
                      <div className="w-full bg-blue-400 rounded-sm" style={{ height: `${Math.max(5, humidityHeight)}%` }} />
                      <div className="w-full bg-green-400 rounded-sm" style={{ height: `${Math.max(5, pressureHeight)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-lg text-xs">
                <div>Ameliyathane 1</div>
                <div>Tüm Değerler Normal</div>
                <div>Son Güncelleme: 10:45</div>
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded" />
                  <span>Sıcaklık (°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded" />
                  <span>Nem (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded" />
                  <span>Basınç (Pa)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cihaz Durumu</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">HVAC Sistemi</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durum: Aktif</p>
                  <p>Hava Değişimi: 22/saat</p>
                  <p>Filtrasyon: %99.97</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Aydınlatma</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durum: Optimal</p>
                  <p>Işık Seviyesi: 1000 lux</p>
                  <p>Gölge Oranı: %5</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Güç Sistemi</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durum: Stabil</p>
                  <p>Ana Güç: Normal</p>
                  <p>Yedek: Hazır</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Ses Sistemi</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durum: Aktif</p>
                  <p>Gürültü: 35 dB</p>
                  <p>İletişim: Açık</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Güvenlik</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durum: Güvenli</p>
                  <p>Erişim: Kontrollü</p>
                  <p>Alarm: Kapalı</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Kayıt Sistemi</h3>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durum: Kayıt Yapıyor</p>
                  <p>Depolama: %78 dolu</p>
                  <p>Kalite: HD 1080p</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}