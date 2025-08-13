import {
  Home,
  Mail,
  Activity,
  Users,
  Heart,
  Scissors,
  TestTube,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLayoutStore } from "@/stores/layout";
import { useEffect, useRef } from "react";

export function Sidebar() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;
  const baseLinkClass =
    "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-50";
  const activeClass = "text-blue-600 bg-blue-50";
  const inactiveClass = "text-gray-600";
  const isSidebarOpen = useLayoutStore((s) => s.isSidebarOpen);
  const closeSidebar = useLayoutStore((s) => s.closeSidebar);
  const drawerRef = useRef(null);

  // Accessibility: focus trap entry + Escape, body scroll lock for mobile drawer
  useEffect(() => {
    if (!isSidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', onKeyDown);
    // focus the drawer container on open
    drawerRef.current?.focus?.();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isSidebarOpen, closeSidebar]);

  const Nav = ({ onNavigate }) => (
    <nav className="px-4 py-4" role="navigation" aria-label="Birincil">
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          GENEL
        </p>
        <div className="space-y-1">
          <NavLink
            to="/"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/bildirimler"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Mail className="w-4 h-4" />
            <span>Bildirimler</span>
            <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">7</span>
          </NavLink>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          AMELİYATHANE
        </p>
        <div className="space-y-1">
          <NavLink
            to="/ameliyat-planlama"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Scissors className="w-4 h-4" />
            <span>Ameliyat Planlama</span>
          </NavLink>
          <NavLink
            to="/canli-izleme"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Activity className="w-4 h-4" />
            <span>Canlı İzleme</span>
          </NavLink>
          <NavLink
            to="/personel"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Users className="w-4 h-4" />
            <span>Personel</span>
          </NavLink>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          STERİLİZASYON
        </p>
        <div className="space-y-1">
          <NavLink
            to="/sterilizasyon"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <TestTube className="w-4 h-4" />
            <span>Döngü Yönetimi</span>
          </NavLink>
        </div>
      </div>

      {/* Uyumluluk ve Denetim menüleri kaldırıldı */}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20" aria-label="Ana menü">
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Atilla Dental</h1>
        </div>
        <Nav onNavigate={undefined} />
      </aside>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
            onClick={closeSidebar}
          />
          <aside
            className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-50 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Ana menü"
            tabIndex={-1}
            ref={drawerRef}
          >
            <div className="flex items-center justify-between gap-3 h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">Atilla Dental</h1>
              </div>
              <button
                aria-label="Menüyü kapat"
                className="p-2 rounded-md hover:bg-gray-50"
                onClick={closeSidebar}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <Nav onNavigate={closeSidebar} />
          </aside>
        </div>
      )}
    </>
  );
}
