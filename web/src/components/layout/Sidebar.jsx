import {
  Home,
  Mail,
  Activity,
  Users,
  Heart,
  Scissors,
  TestTube,
  
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;
  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
      isActive(path)
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
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
            <Link to="/" className={linkClass("/")}>
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/bildirimler" className={linkClass("/bildirimler")}>
              <Mail className="w-4 h-4" />
              <span>Bildirimler</span>
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">7</span>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            AMELİYATHANE
          </p>
          <div className="space-y-1">
            <Link to="/ameliyat-planlama" className={linkClass("/ameliyat-planlama")}>
              <Scissors className="w-4 h-4" />
              <span>Ameliyat Planlama</span>
            </Link>
            <Link to="/canli-izleme" className={linkClass("/canli-izleme")}>
              <Activity className="w-4 h-4" />
              <span>Canlı İzleme</span>
            </Link>
            <Link to="/personel" className={linkClass("/personel")}>
              <Users className="w-4 h-4" />
              <span>Personel</span>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            STERİLİZASYON
          </p>
          <div className="space-y-1">
            <Link to="/sterilizasyon" className={linkClass("/sterilizasyon")}>
              <TestTube className="w-4 h-4" />
              <span>Döngü Yönetimi</span>
            </Link>
          </div>
        </div>

        {/* Uyumluluk ve Denetim menüleri kaldırıldı */}
      </nav>

      {/* Alt bilgi kutusu kaldırıldı */}
    </aside>
  );
}
