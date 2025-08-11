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
} from "lucide-react";

export default function BildirimlerPage() {
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
              <div className="flex items-center justify-between px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>Bildirimler</span>
                </div>
                <span className="bg-blue-200 text-blue-700 text-xs px-2 py-1 rounded-full">7</span>
              </div>
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
              <a href="/" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                Ameliyathane
              </a>
              <a href="/sterilizasyon" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                Sterilizasyon
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-blue-600 cursor-pointer" />
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
            <span>Atilla Dental</span>
            <span className="mx-2">›</span>
            <span>Bildirimler</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Bildirimler</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Tümünü Okundu İşaretle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Critical Alerts */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-900">Kritik Uyarılar</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-red-900">Sterilizasyon Döngüsü Hatası</h3>
                    <p className="text-sm text-red-700 mt-1">Ameliyathane 2'de sterilizasyon döngüsü #003 başarısız oldu. Acil müdahale gerekli.</p>
                    <p className="text-xs text-red-600 mt-2">2 dakika önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Thermometer className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-orange-900">Sıcaklık Uyarısı</h3>
                    <p className="text-sm text-orange-700 mt-1">Ameliyathane 1'de sıcaklık 25°C'ye yükseldi. Optimum aralık: 20-22°C</p>
                    <p className="text-xs text-orange-600 mt-2">15 dakika önce</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Notifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Sistem Bildirimleri</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Sterilizasyon Döngüsü Tamamlandı</h3>
                    <p className="text-sm text-gray-600 mt-1">Döngü #002 başarıyla tamamlandı. 24 adet cerrahi alet sterilize edildi.</p>
                    <p className="text-xs text-gray-500 mt-2">1 saat önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Personel Giriş Kaydı</h3>
                    <p className="text-sm text-gray-600 mt-1">Hemşire Ayşe Kaya, Ameliyathane 1'e giriş yaptı.</p>
                    <p className="text-xs text-gray-500 mt-2">2 saat önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Günlük Rapor Hazır</h3>
                    <p className="text-sm text-gray-600 mt-1">10 Ağustos 2025 tarihi için günlük operasyon raporu oluşturuldu.</p>
                    <p className="text-xs text-gray-500 mt-2">3 saat önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Scissors className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Ameliyat Başarıyla Tamamlandı</h3>
                    <p className="text-sm text-gray-600 mt-1">Dr. Atilla tarafından gerçekleştirilen implant cerrahisi başarıyla tamamlandı.</p>
                    <p className="text-xs text-gray-500 mt-2">4 saat önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Monitor className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">TV Ekran Sistemi Güncellendi</h3>
                    <p className="text-sm text-gray-600 mt-1">Ameliyathane TV ekran sistemi güncellendi. Yeni hasta bilgi paneli aktif.</p>
                    <p className="text-xs text-gray-500 mt-2">6 saat önce</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Reminders */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900">Bakım Hatırlatıcıları</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-yellow-900">HVAC Sistemi Bakımı</h3>
                    <p className="text-sm text-yellow-700 mt-1">Ameliyathane HVAC sistemi için aylık bakım zamanı geldi. Planlama gerekli.</p>
                    <p className="text-xs text-yellow-600 mt-2">Yarın</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <TestTube className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-yellow-900">Sterilizasyon Cihazı Kalibrasyonu</h3>
                    <p className="text-sm text-yellow-700 mt-1">Autoclave #1 için 6 aylık kalibrasyon kontrolü gerekli.</p>
                    <p className="text-xs text-yellow-600 mt-2">3 gün içinde</p>
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