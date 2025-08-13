import {
  Calendar,
  ExternalLink,
  Eye,
  Play,
  Scissors,
  BarChart3,
  CheckCircle,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AtillaDentalDashboard() {
  return (
    <>
          {/* Başlık ve breadcrumb kaldırıldı */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                <Eye className="w-4 h-4" />
                Sistem durumunu gör
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Play className="w-4 h-4" />
                Sterilizasyon başlat
              </button>
              <Link to="/canli-izleme" className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
                Canlı İzleme
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-4 space-y-6">
              {/* Surgery Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Durum</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Aktif</span>
                  <Calendar className="w-4 h-4 text-gray-400 ml-auto" />
                  <span className="text-sm text-gray-500">
                    Oluşturulma 2025/08/08
                  </span>
                </div>
              </div>

              {/* Premium Surgery Management */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Premium ameliyat yönetimi
                  </h3>
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">+</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Aktif</span>
                </div>
              </div>

              {/* Operating Room List */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Odalar</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-600">Aktif</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-sm text-gray-600">Bakımda</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Daily Sterilization */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Günlük sterilizasyon
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Aktif</span>
                </div>
              </div>

              {/* System Tests */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <Users className="w-4 h-4" />
                    Personel davet et
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                    <Play className="w-4 h-4" />
                    Sistem testi
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">11 Ağu 2025</p>
                      <div className="flex gap-4 text-gray-600">
                        <span>🌡️ 22°C</span>
                        <span>💨 45% nem</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">10 Ağu 2025</p>
                      <div className="flex gap-4 text-gray-600">
                        <span>🌡️ 23°C</span>
                        <span>💨 43% nem</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">9 Ağu 2025</p>
                      <div className="flex gap-4 text-gray-600">
                        <span>🌡️ 21°C</span>
                        <span>💨 47% nem</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">8 Ağu 2025</p>
                      <div className="flex gap-4 text-gray-600">
                        <span>🌡️ 22°C</span>
                        <span>💨 44% nem</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">7 Ağu 2025</p>
                      <div className="flex gap-4 text-gray-600">
                        <span>🌡️ 23°C</span>
                        <span>💨 46% nem</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Compliance Snapshot (SKS/JCI) */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Uyumluluk Özeti</h3>
                <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                  <li>Hasta Güvenliği Hedefleri</li>
                  <li>Sterilizasyon Kalite Göstergeleri</li>
                  <li>Olay Bildirimleri</li>
                  <li>Dokümantasyon ve Denetim</li>
                  <li>Eğitim Uyumu</li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-8 space-y-6">
              {/* Overview Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Genel Bakış
                  </h2>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Rapor indir
                  </button>
                </div>

                {/* Surgery Stats */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Scissors className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      AMELİYATHANE
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Hasta güvenliği ve operasyonel verimlilik ile ortaklaşa
                    çalışın
                  </p>

                  {/* Chart */}
                  <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                      <span>25</span>
                      <span>30</span>
                    </div>

                    {/* Mock Chart Bars */}
                    <div className="flex items-end justify-between h-40 gap-1">
                      {Array.from({ length: 30 }, (_, i) => {
                        const heights = [
                          20, 35, 45, 25, 60, 40, 80, 30, 50, 70, 25, 40, 85,
                          35, 45, 55, 30, 75, 40, 65, 50, 35, 90, 45, 55, 35,
                          70, 40, 60, 45,
                        ];
                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-full bg-blue-200 rounded-sm"
                              style={{ height: `${heights[i]}%` }}
                            ></div>
                            <div
                              className="w-full bg-orange-200 rounded-sm"
                              style={{ height: `${heights[i] * 0.6}%` }}
                            ></div>
                            <div
                              className="w-full bg-purple-200 rounded-sm"
                              style={{ height: `${heights[i] * 0.4}%` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute top-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-sm">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-xs text-gray-300">
                        Günlük Operasyon
                      </div>
                      <div className="mt-2">
                        <div className="text-lg font-semibold">18</div>
                        <div className="text-xs text-gray-300">
                          Başarılı Operasyon
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-lg font-semibold">6</div>
                        <div className="text-xs text-gray-300">Planlanmış</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-200 rounded"></div>
                      <span className="text-gray-600">Günlük Operasyon</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-200 rounded"></div>
                      <span className="text-gray-600">Başarılı Operasyon</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-200 rounded"></div>
                      <span className="text-gray-600">Planlanmış</span>
                    </div>
                  </div>
                </div>

                {/* Performance Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      PERFORMANS
                    </h3>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div></div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">
                        Ortalama{" "}
                        <span className="text-blue-600 font-semibold">
                          87.5%
                        </span>
                      </span>
                      <span className="text-gray-500">
                        Verimlilik{" "}
                        <span className="text-green-600 font-semibold">
                          92.1%
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="relative h-32 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-end justify-between h-20 gap-1">
                      {Array.from({ length: 50 }, (_, i) => {
                        const heights = [
                          75, 80, 85, 82, 90, 78, 88, 83, 87, 92, 79, 86, 94,
                          88, 90, 85, 82, 89, 86, 91, 87, 83, 95, 89, 92, 86,
                          88, 84, 90, 89, 85, 91, 87, 93, 86, 89, 92, 88, 94,
                          87, 90, 86, 89, 85, 91, 88, 93, 87, 89, 90,
                        ];
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-blue-400 rounded-sm"
                            style={{ height: `${heights[i]}%` }}
                          ></div>
                        );
                      })}
                    </div>

                    {/* Efficiency Tooltip */}
                    <div className="absolute top-2 right-8 bg-gray-800 text-white p-2 rounded text-xs">
                      <div>11 Ağustos 2025 - 22:38</div>
                      <div>
                        Verimlilik: <span className="text-blue-400">87.5%</span>
                      </div>
                    </div>

                    {/* Time Labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>16:00</span>
                      <span>20:00</span>
                      <span>00:00</span>
                      <span>04:00</span>
                      <span>08:00</span>
                    </div>
                  </div>

                  {/* Performance Scale */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>70%</span>
                    <span>80%</span>
                    <span>90%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  );
}
