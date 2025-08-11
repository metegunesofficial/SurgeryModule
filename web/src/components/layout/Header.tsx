"use client";
import { Bell, Search, User, Menu } from 'lucide-react';
import { useSidebar } from '@/app/providers';
import { useState } from 'react';

export function Header() {
  const [q, setQ] = useState("");
  const { open, setOpen } = useSidebar();
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between h-14 px-4 gap-3">
        <div className="flex items-center gap-2 flex-1">
          <button aria-label="Menü" className="md:hidden p-2 rounded hover:bg-[var(--primary-blue-light)]" onClick={()=>setOpen(!open)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-[var(--text-gray)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara..."
              className="w-full pl-9 pr-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue-light)]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border rounded">Zararlı taraması</button>
          <a href="/display" className="btn-primary px-3 py-2">TV Ekranı</a>
          <button aria-label="Bildirimler" className="p-2 rounded hover:bg-[var(--primary-blue-light)]">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-[var(--primary-blue)] flex items-center justify-center text-white">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}


