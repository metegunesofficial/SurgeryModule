import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/utils/useAuth.js";
import { useLayoutStore } from "@/stores/layout";

export function Header() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 sticky top-0 z-40">
      <div className="h-full flex items-center justify-between">
        <div className="h-10 flex items-center">
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Menüyü aç"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={useLayoutStore((s) => s.openSidebar)}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="user-menu-button"
            type="button"
            aria-haspopup="menu"
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"
              alt="Dr. Atilla"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-gray-900 font-medium leading-tight">Dr. Atilla</p>
              <p className="text-gray-500 text-xs leading-tight">atilla@altaydental.com</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="user-menu"
          role="menu"
          aria-labelledby="user-menu-button"
          className="absolute right-6 top-14 z-50 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2"
        >
          <Link
            to="/account"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4" /> Profilim
          </Link>
          <Link
            to="/ayarlar"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Settings className="w-4 h-4" /> Ayarlar
          </Link>
          <button
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut className="w-4 h-4" /> Çıkış
          </button>
        </div>
      )}
    </header>
  );
}
