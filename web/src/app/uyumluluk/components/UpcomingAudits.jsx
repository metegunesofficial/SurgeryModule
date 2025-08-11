import { Calendar, Building, Shield } from "lucide-react";

export function UpcomingAudits() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Yaklaşan Denetimler
      </h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-900">İç Denetim</p>
            <p className="text-xs text-orange-700 mt-1">
              SKS Standartları - Çeyreklik değerlendirme
            </p>
            <p className="text-xs text-orange-600 mt-1">25 Ağustos 2025</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Building className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">JCI Ön Denetimi</p>
            <p className="text-xs text-blue-700 mt-1">
              Akreditasyon hazırlık değerlendirmesi
            </p>
            <p className="text-xs text-blue-600 mt-1">15 Eylül 2025</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Shield className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Sağlık Bakanlığı
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Yıllık kontrol ve denetim
            </p>
            <p className="text-xs text-gray-500 mt-1">Aralık 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
