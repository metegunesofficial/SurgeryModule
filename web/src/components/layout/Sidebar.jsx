import {
  Home,
  Mail,
  Activity,
  Shield,
  Users,
  Heart,
  Scissors,
  TestTube,
  Award,
  Download,
  ExternalLink,
  Building,
} from "lucide-react";

export function Sidebar() {
  return (
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
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            GENEL
          </p>
          <div className="space-y-1">
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
            <a
              href="/bildirimler"
              className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Bildirimler</span>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                7
              </span>
            </a>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            AMELİYATHANE
          </p>
          <div className="space-y-1">
            <a
              href="/ameliyat-planlama"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              <span>Ameliyat Planlama</span>
            </a>
            <a
              href="/canli-izleme"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Canlı İzleme</span>
            </a>
            <a
              href="/guvenlik"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Güvenlik</span>
            </a>
            <a
              href="/personel"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Personel</span>
            </a>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            STERİLİZASYON
          </p>
          <div className="space-y-1">
            <a
              href="/sterilizasyon"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <TestTube className="w-4 h-4" />
              <span>Döngü Yönetimi</span>
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            UYUMLULUK
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md">
              <Award className="w-4 h-4" />
              <span>SKS/JCI Kontrolleri</span>
            </div>
            <a
              href="/denetim"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
            >
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
  );
}
