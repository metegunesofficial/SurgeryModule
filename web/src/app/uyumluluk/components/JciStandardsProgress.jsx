export function JciStandardsProgress() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          JCI Standartları Hazırlık Durumu
        </h2>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Genel İlerleme:</div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: "78%" }}
              ></div>
            </div>
            <span className="text-sm font-medium text-blue-600">78%</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Standart
              </th>
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Açıklama
              </th>
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                İlerleme
              </th>
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Durum
              </th>
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Son Tarih
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-3 font-medium text-gray-900">IPSG.1</td>
              <td className="py-3 px-3 text-sm text-gray-600">
                Hasta kimliği doğru tanımlanır
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-xs">100%</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Tamamlandı
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-gray-500">Ağu 2025</td>
            </tr>

            <tr className="border-b border-gray-100">
              <td className="py-3 px-3 font-medium text-gray-900">IPSG.2</td>
              <td className="py-3 px-3 text-sm text-gray-600">
                İletişimin etkinliği artırılır
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                  <span className="text-xs">95%</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  Devam Ediyor
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-gray-500">Ağu 2025</td>
            </tr>

            <tr className="border-b border-gray-100">
              <td className="py-3 px-3 font-medium text-gray-900">IPSG.3</td>
              <td className="py-3 px-3 text-sm text-gray-600">
                Yüksek riskli ilaçlar güvence altına alınır
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="text-xs">75%</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                  İnceleme
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-gray-500">Eyl 2025</td>
            </tr>

            <tr className="border-b border-gray-100">
              <td className="py-3 px-3 font-medium text-gray-900">IPSG.4</td>
              <td className="py-3 px-3 text-sm text-gray-600">
                Doğru hasta, prosedür ve bölge güvence altına alınır
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                  <span className="text-xs">90%</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  Devam Ediyor
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-gray-500">Ağu 2025</td>
            </tr>

            <tr className="border-b border-gray-100">
              <td className="py-3 px-3 font-medium text-gray-900">IPSG.5</td>
              <td className="py-3 px-3 text-sm text-gray-600">
                Sağlık bakımı ile ilişkili enfeksiyonlar azaltılır
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-xs">100%</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Tamamlandı
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-gray-500">Tem 2025</td>
            </tr>

            <tr className="border-b border-gray-100">
              <td className="py-3 px-3 font-medium text-gray-900">IPSG.6</td>
              <td className="py-3 px-3 text-sm text-gray-600">
                Hasta düşme riskini azaltılır
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-red-500 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <span className="text-xs">45%</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                  Beklemede
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-gray-500">Eki 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
