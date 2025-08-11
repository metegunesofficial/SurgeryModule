import { AlertTriangle, Clock, BookOpen, Plus } from "lucide-react";

export function ActionItems() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Aksiyon Gerektiren Konular
        </h2>
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
          <Plus className="w-4 h-4" />
          Yeni Aksiyon Ekle
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Yüksek Öncelik</h3>
            <p className="text-sm text-red-700 mt-1">
              KYG.6 - Hasta şikayetleri sisteminin güncellenmesi gerekiyor
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-red-600">
              <span>Sorumlu: Kalite Yöneticisi</span>
              <span>Son Tarih: 20 Ağu 2025</span>
              <span className="bg-red-100 px-2 py-1 rounded">5 gün kaldı</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-900">Orta Öncelik</h3>
            <p className="text-sm text-yellow-700 mt-1">
              HGS.6 - Hasta düşme riski değerlendirme prosedürü eksik
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-yellow-600">
              <span>Sorumlu: Hemşirelik Müdürü</span>
              <span>Son Tarih: 30 Ağu 2025</span>
              <span className="bg-yellow-100 px-2 py-1 rounded">
                15 gün kaldı
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">Düşük Öncelik</h3>
            <p className="text-sm text-blue-700 mt-1">
              IPSG.3 - İlaç saklama protokollerinin güncellenmesi
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
              <span>Sorumlu: Eczane Müdürü</span>
              <span>Son Tarih: 15 Eyl 2025</span>
              <span className="bg-blue-100 px-2 py-1 rounded">30 gün kaldı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
