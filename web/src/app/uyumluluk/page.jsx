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
  Award,
  Download,
  Upload,
  Search,
  Filter,
  Star,
  Target,
  BookOpen,
  Building,
  Plus
} from "lucide-react";

export default function UyumlulukPage() {
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
              <a href="/ameliyat-planlama" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Scissors className="w-4 h-4" />
                <span>Ameliyat Planlama</span>
              </a>
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
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">STERİLİZASYON</p>
            <div className="space-y-1">
              <a href="/sterilizasyon" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <TestTube className="w-4 h-4" />
                <span>Döngü Yönetimi</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">UYUMLULUK</p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md">
                <Award className="w-4 h-4" />
                <span>SKS/JCI Kontrolleri</span>
              </div>
              <a href="/denetim" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Building className="w-4 h-4" />
                <span>Denetim Hazırlık</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <p className="text-gray-900 font-medium">SKS Sertifikalı</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <Download className="w-3 h-3" />
                <span className="text-xs">Sertifika</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs">Detaylar</span>
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
              <a href="/" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
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
              <a href="/uyumluluk" className="text-blue-600 border-b-2 border-blue-600 pb-4 text-sm font-medium">
                SKS/JCI Uyumluluk
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <Award className="w-4 h-4" />
                <span>Sertifikalı</span>
              </div>
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
            <span>Uyumluluk</span>
            <span className="mx-2">›</span>
            <span>SKS/JCI Kontrolleri</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Kalite Standartları ve Uyumluluk</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                Belge Yükle
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Uyumluluk Raporu
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Compliance Overview */}
            <div className="col-span-4 space-y-6">
              {/* Certification Status */}
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
                </div>
              </div>

              {/* Compliance Score */}
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
                          <div className="w-15 h-2 bg-green-500 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">96%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enfeksiyon Kontrolü</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-15 h-2 bg-green-500 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">98%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Audits */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Yaklaşan Denetimler</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">İç Denetim</p>
                      <p className="text-xs text-orange-700 mt-1">SKS Standartları - Çeyreklik değerlendirme</p>
                      <p className="text-xs text-orange-600 mt-1">25 Ağustos 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Building className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">JCI Ön Denetimi</p>
                      <p className="text-xs text-blue-700 mt-1">Akreditasyon hazırlık değerlendirmesi</p>
                      <p className="text-xs text-blue-600 mt-1">15 Eylül 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Standards and Checklists */}
            <div className="col-span-8 space-y-6">
              {/* SKS Standards Checklist */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">SKS Standartları Kontrol Listesi</h2>
                  <div className="flex gap-3">
                    <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md px-3 py-1">Son Güncelleme: 08.08.2025</button>
                    <button className="text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1">Güncelle</button>
                  </div>
                </div>

                {/* Standard Categories */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Patient Safety Standards */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Hasta Güvenliği Standartları (HGS)</h3>
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
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>HGS.6 - Hasta düşme riski</span>
                      </div>
                    </div>
                  </div>

                  {/* Quality Management Standards */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Kalite Yönetimi ve Güvenlik (KYG)</h3>
                      <span className="text-sm text-green-600 font-medium">18/20 ✓</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>KYG.1 - Kalite yönetim sistemi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>KYG.6 - Hasta şikayetleri</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Aksiyon Gerektiren Konular</h2>
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
                      <p className="text-sm text-red-700 mt-1">KYG.6 - Hasta şikayetleri sisteminin güncellenmesi gerekiyor</p>
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
                      <p className="text-sm text-yellow-700 mt-1">HGS.6 - Hasta düşme riski değerlendirme prosedürü eksik</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-yellow-600">
                        <span>Sorumlu: Hemşirelik Müdürü</span>
                        <span>Son Tarih: 30 Ağu 2025</span>
                        <span className="bg-yellow-100 px-2 py-1 rounded">15 gün kaldı</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}