"use client";
import { useEffect, useState } from 'react';

type Item = {
  id: string;
  roomId: string | null;
  patient: string;
  procedure: string;
  status: string;
  start: string;
  remainingMinutes: number;
};

export default function DisplayPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch('/api/display/surgeries')
      .then((r) => r.json())
      .then((d) => !ignore && setItems(d.items ?? []));

    const evt = new EventSource('/api/display/live');
    evt.onmessage = () => {
      fetch('/api/display/surgeries')
        .then((r) => r.json())
        .then((d) => setItems(d.items ?? []));
    };
    return () => {
      ignore = true;
      evt.close();
    };
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Ameliyathane Durum Ekranı</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="p-6 card">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{s.roomId ?? 'Atanmamış Oda'}</div>
              <span className="text-sm rounded px-2 py-1 bg-[var(--primary-blue-light)]">{s.status}</span>
            </div>
            <div className="mt-3 text-2xl font-medium">{s.patient}</div>
            <div className="text-sm text-[var(--text-gray)]">{s.procedure}</div>
            <div className="mt-4 text-sm">{new Date(s.start).toLocaleTimeString()} · ~{s.remainingMinutes} dk</div>
          </div>
        ))}
        {!items.length && (
          <div className="text-[var(--text-gray)]">Gösterilecek ameliyat bilgisi yok.</div>
        )}
      </div>
    </div>
  );
}


