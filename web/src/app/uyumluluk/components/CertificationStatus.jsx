import { Award, Building, Target } from "lucide-react";

export function CertificationStatus() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Sertifikasyon Durumu
      </h3>

      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900">
                SKS Sertifikası
              </span>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Aktif
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <p>Veriliş: 15 Mart 2024</p>
            <p>Geçerlilik: 15 Mart 2027</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>Sertifika No: SKS-2024-12345</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">
                JCI Akreditasyonu
              </span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Süreçte
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <p>Başvuru: 10 Ocak 2025</p>
            <p>Denetim: 20 Eylül 2025</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>Hazırlık: %78 tamamlandı</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">
                ISO 9001
              </span>
            </div>
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              Planlı
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <p>Planlanan: 2026 Q1</p>
            <p>Hazırlık Başlangıcı: Şubat 2025</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>Ön Değerlendirme Gerekli</p>
          </div>
        </div>
      </div>
    </div>
  );
}
