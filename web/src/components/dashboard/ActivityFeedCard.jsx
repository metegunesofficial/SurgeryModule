import { useMemo, useState } from 'react';

export default function ActivityFeedCard({ items, fixedHeight = 360, showLink = false, linkHref = '/aktivite' }) {
  const [filters, setFilters] = useState({ q: '', person: '', from: '', to: '', type: '' });
  const people = useMemo(() => {
    const set = new Set();
    items.forEach((it) => {
      if (it.meta?.doctor_from) set.add(it.meta.doctor_from);
      if (it.meta?.doctor_to) set.add(it.meta.doctor_to);
      if (it.meta?.author) set.add(it.meta.author);
    });
    return Array.from(set);
  }, [items]);
  const types = useMemo(() => {
    const s = new Set();
    items.forEach((it) => { if (it.meta?.type) s.add(it.meta.type); });
    return Array.from(s);
  }, [items]);
  const filtered = useMemo(() => {
    return items.filter((it) => {
      const text = `${it.title || it.text || ''} ${it.meta ? Object.values(it.meta).join(' ') : ''}`.toLowerCase();
      const qOk = !filters.q || text.includes(filters.q.toLowerCase());
      const pOk = !filters.person || (it.meta && [it.meta.doctor_from, it.meta.doctor_to, it.meta.author].filter(Boolean).includes(filters.person));
      const tOk = !filters.type || (it.meta && it.meta.type === filters.type);
      const ts = it.ts instanceof Date ? it.ts : new Date(it.ts);
      const fromOk = !filters.from || ts >= new Date(filters.from + 'T00:00:00');
      const toOk = !filters.to || ts <= new Date(filters.to + 'T23:59:59');
      return qOk && pOk && tOk && fromOk && toOk;
    });
  }, [items, filters]);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex flex-col" style={{ height: `clamp(320px, 65vh, ${fixedHeight}px)` }}>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Genel Bakış (Aktivite Akışı)</h2>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="grid grid-cols-12 gap-2 flex-1 min-w-0 w-full sm:mr-2">
          <select className="col-span-6 lg:col-span-3 border rounded px-2 py-1 text-sm" value={filters.type} onChange={(e) => setFilters((s) => ({ ...s, type: e.target.value }))}>
            <option value="">İşlem Türü (Tümü)</option>
            {types.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
          <input className="col-span-12 lg:col-span-3 border rounded px-2 py-1 text-sm" placeholder="Tümü" value={filters.q} onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))} />
          <select className="col-span-6 lg:col-span-3 border rounded px-2 py-1 text-sm" value={filters.person} onChange={(e) => setFilters((s) => ({ ...s, person: e.target.value }))}>
            <option value="">Kişi (Tümü)</option>
            {people.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
          <div className="col-span-6 lg:col-span-3 grid grid-cols-2 gap-2">
            <input type="date" className="border rounded px-2 py-1 text-sm" value={filters.from} onChange={(e) => setFilters((s) => ({ ...s, from: e.target.value }))} />
            <input type="date" className="border rounded px-2 py-1 text-sm" value={filters.to} onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))} />
          </div>
        </div>
        {showLink && <a href={linkHref} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 shrink-0">Tümünü Gör</a>}
      </div>
      <ol className="relative border-l border-gray-200 ml-2 overflow-y-auto pr-1 flex-1 min-h-0">
        {filtered.map((it, idx) => (
          <li key={idx} className="mb-5 ml-4 break-words">
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-500 border border-white" />
            <time className="block text-xs text-gray-500 mb-1">{it.ts.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: undefined })}</time>
            {it.title ? (
              <div>
                <p className="text-sm font-medium text-gray-900 break-words">{it.title}</p>
                {it.meta && (
                  <div className="mt-1 text-xs text-gray-700 space-y-0.5 break-words">
                    <div>Doktor: {it.meta.doctor_from} → {it.meta.doctor_to}</div>
                    <div>Tarih: {it.meta.date}</div>
                    <div>Süre: {it.meta.duration}</div>
                    <div>Randevu Tipi: {it.meta.type}</div>
                    <div>Randevu Durumu: {it.meta.status}</div>
                    <div>Açıklama: {it.meta.note}</div>
                    <div className="text-gray-500">Güncelleyen: {it.meta.author}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-800 break-words">{it.text}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}


