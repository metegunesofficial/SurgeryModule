"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, FlaskConical, FileBarChart, Settings } from 'lucide-react';
import { useState } from 'react';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const features: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/surgeries', label: 'Ameliyathane', icon: Activity },
  { href: '/sterilization', label: 'Sterilizasyon', icon: FlaskConical },
  { href: '/reports', label: 'Raporlar', icon: FileBarChart },
];

const support: NavItem[] = [
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

function NavSection({ title, items, collapsed, onToggle }: { title: string; items: NavItem[]; collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  return (
    <div>
      <button onClick={onToggle} className="w-full text-left text-xs tracking-wide text-[var(--text-gray)] px-3 py-2">
        {title}
      </button>
      {!collapsed && (
        <ul className="mb-2">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${active ? 'bg-[var(--primary-blue-light)]' : 'hover:bg-[var(--primary-blue-light)]'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Sidebar() {
  const [featOpen, setFeatOpen] = useState(true);
  const [supOpen, setSupOpen] = useState(true);
  // simple responsive toggle via context when needed
  const className = "w-64 shrink-0 h-dvh p-4 border-r bg-[var(--gray-50)]";
  return (
    <aside className={className}>
      <div className="flex items-center gap-2 font-semibold mb-4">
        <div className="h-8 w-8 rounded bg-[var(--primary-blue)]" />
        <span>MedikaSimple</span>
      </div>
      <nav className="space-y-2">
        <NavSection title="ÖZELLİKLER" items={features} collapsed={!featOpen} onToggle={() => setFeatOpen((v) => !v)} />
        <NavSection title="DESTEK" items={support} collapsed={!supOpen} onToggle={() => setSupOpen((v) => !v)} />
      </nav>
    </aside>
  );
}


