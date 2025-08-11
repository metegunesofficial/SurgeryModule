import {
  Home,
  Mail,
  Calendar,
  Activity,
  Shield,
  Users,
  Heart,
  FileText,
  Database,
  Settings,
  HelpCircle,
  Bell,
  ExternalLink,
  Copy,
  Play,
  Eye,
  TrendingUp,
  BarChart3,
  ChevronDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Monitor,
  Thermometer,
  Zap,
  Wind,
  Scissors,
  TestTube,
  Package,
  Clipboard,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit
} from "lucide-react";

export default function AmeliyatPlanlamaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Atilla Dental</h1>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">GENEL</p>
            <div className="space-y-1">
              <a href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              <a href="/bildirimler" className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>Bildirimler</span>
                </div>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">7</span>
              </a>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AMELİYATHANE</p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md">
                <Scissors className="w-4 h-4" />
                <span>Ameliyat Planlama</span>
              </div>
              <a href="/canli-izleme" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Activity className="w-4 h-4" />
                <span>Canlı İzleme</span>
              </a>
              <a href="/guvenlik" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Shield className="w-4 h-4" />
                <span>Güvenlik</span>
              </a>
              <a href="/personel" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Users className="w-4 h-4" />
                <span>Personel</span>
              </a>
              <a href="/tv-ekranlari" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Monitor className="w-4 h-4" />
                <span>TV Ekranları</span>
              </a>
              <a href="/raporlar" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>Raporlar</span>
              </a>
              <a href="/kontrol-listeleri" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Clipboard className="w-4 h-4" />
                <span>Kontrol Listeleri</span>
              </a>
              <a href="/hasta-kayitlari" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Database className="w-4 h-4" />
                <span>Hasta Kayıtları</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">STERİLİZASYON</p>
            <div className="space-y-1">
              <a href="/sterilizasyon" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <TestTube className="w-4 h-4" />
                <span>Döngü Yönetimi</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gray-50 rounded-md p-3 text-sm">
            <p className="text-gray-900 font-medium">Ameliyathane 1 - Ana Oda</p>
            <div className="flex gap-2 mt-2">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <Copy className="w-3 h-3" />
                <span className="text-xs">Rapor Kopyala</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs">Canlı İzle</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-8">
              <a href="/" className="text-blue-600 border-b-2 border-blue-600 pb-4 text-sm font-medium">
                Ameliyathane
              </a>
              <a href="/sterilizasyon" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                Sterilizasyon
              </a>
              <a href="/tv-ekranlari" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                TV Ekranları
              </a>
              <a href="/raporlar" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                Raporlar
              </a>
              <a href="/uyumluluk" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                SKS/JCI Uyumluluk
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-400 cursor-pointer" />
              <HelpCircle className="w-5 h-5 text-gray-400 cursor-pointer" />
              <div className="flex items-center gap-2">
                <img
                  src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"
                  alt="Dr. Atilla"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Dr. Atilla</p>
                  <p className="text-gray-500 text-xs">atilla@altaydental.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <nav className="text-sm text-gray-500 mb-4">
            <span>Ameliyathane</span>
            <span className="mx-2">›</span>
            <span>Ameliyat Planlama</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Ameliyat Planlama</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filtrele
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Yeni Ameliyat Planla
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Planning Calendar */}
            <div className="col-span-4 space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Bugünün Programı</h3>
                  <span className="text-sm text-gray-500">11 Ağustos 2025</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-8 bg-green-500 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">İmplant Cerrahisi</p>
                      <p className="text-sm text-gray-600">Dr. Atilla - Hasta: Ahmet Y.</p>
                      <p className="text-xs text-gray-500">09:00 - 11:30 (150 dk)</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>

                  <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-8 bg-blue-500 rounded"></div>
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
                      <div className="w-2 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Kanal Tedavisi</p>
                      <p className="text-sm text-gray-600">Dr. Ayşe - Hasta: Emre D.</p>
                      <p className="text-xs text-gray-500">16:00 - 17:30 (90 dk)</p>
                    </div>
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Room Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Ameliyathane Durumu</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-900">Ameliyathane 1</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>Kullanımda</span>
                      <br />
                      <span>Bitiş: 11:30</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-900">Ameliyathane 2</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>Sterilizasyon</span>
                      <br />
                      <span>Hazır: 13:00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-900">Ameliyathane 3</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>Müsait</span>
                      <br />
                      <span>Hazır</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-operative Checklist */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Ameliyat Öncesi Kontrol</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Hasta kimlik kontrolü</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Anestezi onayı alındı</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Cerrahi alan işaretlendi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Sterilizasyon kontrolü</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Ameliyathane hazırlığı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-8 space-y-6">
              {/* Weekly Schedule Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Haftalık Planlama</h2>
                  <div className="flex gap-2">
                    <button className="text-sm text-gray-500 hover:text-gray-700">← Önceki Hafta</button>
                    <span className="text-sm font-medium text-gray-900">5-11 Ağustos 2025</span>
                    <button className="text-sm text-gray-500 hover:text-gray-700">Sonraki Hafta →</button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                    <div key={day} className="p-2 text-center">
                      <div className="text-xs font-medium text-gray-500">{day}</div>
                      <div className={`text-sm font-medium mt-1 ${index === 6 ? 'text-blue-600' : 'text-gray-900'}`}>
                        {5 + index}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Surgery Schedule Grid */}
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
                        <div
                          key={surgeryIndex}
                          className={`p-1 mb-1 rounded text-xs ${
                            surgery.type === 'implant' ? 'bg-blue-100 text-blue-700' :
                            surgery.type === 'extraction' ? 'bg-green-100 text-green-700' :
                            surgery.type === 'root-canal' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="font-medium">{surgery.time}</div>
                          <div className="truncate">{surgery.doctor}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                    <span>İmplant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 rounded"></div>
                    <span>Çekim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-100 rounded"></div>
                    <span>Kanal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <span>Temizlik</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Surgeries */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yaklaşan Ameliyatlar</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Hasta ara..."
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            İmplant Cerrahisi
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dr. Atilla</td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-900">11 Ağu, 09:00</div>
                          <div className="text-xs text-gray-500">150 dakika</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Oda 1</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Devam Ediyor
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button className="text-gray-400 hover:text-gray-600">
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Diş Çekimi
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dr. Mehmet</td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-900">11 Ağu, 14:00</div>
                          <div className="text-xs text-gray-500">45 dakika</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Oda 2</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                            Bekliyor
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button className="text-gray-400 hover:text-gray-600">
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                            Kanal Tedavisi
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Dr. Ayşe</td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-900">11 Ağu, 16:00</div>
                          <div className="text-xs text-gray-500">90 dakika</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">Oda 3</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            Planlandı
                          </span>
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
      </div>
    </div>
  );
}