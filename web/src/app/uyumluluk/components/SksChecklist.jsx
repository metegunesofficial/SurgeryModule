import { CheckCircle, Clock, XCircle } from "lucide-react";

export function SksChecklist() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          SKS Standartları Kontrol Listesi
        </h2>
        <div className="flex gap-3">
          <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md px-3 py-1">
            Son Güncelleme: 08.08.2025
          </button>
          <button className="text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1">
            Güncelle
          </button>
        </div>
      </div>

      {/* Standard Categories */}
      <div className="grid grid-cols-1 gap-4">
        {/* Patient Safety Standards */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Hasta Güvenliği Standartları (HGS)
            </h3>
            <span className="text-sm text-green-600 font-medium">22/23 ✓</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>HGS.1 - Hasta kimlik doğrulama</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>HGS.2 - İletişim güvenliği</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>HGS.3 - Yüksek riskli ilaçlar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>HGS.4 - Cerrahi güvenlik</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>HGS.5 - Enfeksiyon kontrolü</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>HGS.6 - Hasta düşme riski</span>
            </div>
          </div>
        </div>

        {/* Quality Management Standards */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Kalite Yönetimi ve Güvenlik (KYG)
            </h3>
            <span className="text-sm text-green-600 font-medium">18/20 ✓</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>KYG.1 - Kalite yönetim sistemi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>KYG.2 - Risk yönetimi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>KYG.3 - Olay raporlama</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>KYG.4 - Performans iyileştirme</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>KYG.5 - Hasta hakları</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>KYG.6 - Hasta şikayetleri</span>
            </div>
          </div>
        </div>

        {/* Infection Control Standards */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Enfeksiyon Kontrol ve Önleme (EKÖ)
            </h3>
            <span className="text-sm text-green-600 font-medium">15/15 ✓</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>EKÖ.1 - Enfeksiyon kontrol programı</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>EKÖ.2 - El hijyeni</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>EKÖ.3 - Sterilizasyon</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>EKÖ.4 - Atık yönetimi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>EKÖ.5 - İzolasyon önlemleri</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>EKÖ.6 - Çevre temizliği</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
