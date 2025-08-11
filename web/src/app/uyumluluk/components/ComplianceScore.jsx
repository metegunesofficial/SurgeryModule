export function ComplianceScore() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Uyumluluk Skoru
      </h3>

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">94.2%</div>
          <p className="text-sm text-gray-600">Genel Uyumluluk</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hasta Güvenliği</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="w-15 h-2 bg-green-500 rounded-full"
                  style={{ width: "96%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">96%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Enfeksiyon Kontrolü</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="w-15 h-2 bg-green-500 rounded-full"
                  style={{ width: "98%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">98%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kalite Yönetimi</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="w-15 h-2 bg-green-500 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">92%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Personel Yönetimi</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="w-15 h-2 bg-yellow-500 rounded-full"
                  style={{ width: "89%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">89%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Bilgi Yönetimi</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="w-15 h-2 bg-green-500 rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
