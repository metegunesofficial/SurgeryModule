import { useMemo } from "react";
import { useSterilizationStore } from "@/stores/sterilization";

function addMinutes(base, minutes) {
  const d = new Date(base);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

export default function AktiviteAkisiPage() {
  const { events: scanEvents } = useSterilizationStore();
  const now = new Date();

  const items = useMemo(() => {
    const visual = [
      {
        ts: addMinutes(now, -1),
        title: 'TRACEY LEE TAYLOR | Cerrahi isimli randevu güncellendi',
        meta: {
          doctor_from: 'Aslı Ataseven',
          doctor_to: 'Mehmet Işlek',
          date: '13.10.2025 09:00:00',
          duration: '90dk',
          type: 'Cerrahi',
          status: 'Bekleniyor',
          note: 'IMP ÜZERI AÇILIMI',
          author: 'Aslı Ataseven',
        },
      },
      {
        ts: addMinutes(now, -2),
        title: 'HAYLEY UNDERWOOD | Cerrahi isimli randevu güncellendi',
        meta: {
          doctor_from: 'Aslı Ataseven',
          doctor_to: 'Mehmet Işlek',
          date: '13.10.2025 08:30:00',
          duration: '90dk',
          type: 'Cerrahi',
          status: 'Bekleniyor',
          note: 'IMP ÜZERI AÇILIMI',
          author: 'Aslı Ataseven',
        },
      },
      {
        ts: addMinutes(now, -3),
        title: 'LEE GEORGE APPLEBY | Cerrahi isimli randevu güncellendi',
        meta: {
          doctor_from: 'Aslı Ataseven',
          doctor_to: 'Mehmet Işlek',
          date: '06.10.2025 11:00:00',
          duration: '90dk',
          type: 'Cerrahi',
          status: 'Bekleniyor',
          note: 'IMP ÜZERI AÇILIMI',
          author: 'Aslı Ataseven',
        },
      },
      {
        ts: addMinutes(now, -4),
        title: 'CHRISTINA ROBERTSON KENEY | Cerrahi isimli randevu güncellendi',
        meta: {
          doctor_from: 'Aslı Ataseven',
          doctor_to: 'Mehmet Işlek',
          date: '06.10.2025 09:00:00',
          duration: '90dk',
          type: 'Cerrahi',
          status: 'Bekleniyor',
          note: 'IMP ÜZERI AÇILIMI',
          author: 'Aslı Ataseven',
        },
      },
      {
        ts: addMinutes(now, -5),
        title: 'JACQUELINE ELIZABETH HELEN WOODHOUSE | Cerrahi isimli randevu güncellendi',
        meta: {
          doctor_from: 'Aslı Ataseven',
          doctor_to: 'Mehmet Işlek',
          date: '06.10.2025 09:00:00',
          duration: '90dk',
          type: 'Cerrahi',
          status: 'Bekleniyor',
          note: 'IMP ÜZERI AÇILIMI',
          author: 'Aslı Ataseven',
        },
      },
    ];
    const scanDerived = (scanEvents || []).slice(-10).map((e) => ({
      ts: new Date(e.ts),
      text: `${e.event_type} — Kit ${e.kit_id} @ ${e.location}`,
    }));
    const merged = [...visual, ...scanDerived];
    return merged.sort((a, b) => b.ts.getTime() - a.ts.getTime());
  }, [scanEvents]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-base font-semibold text-gray-900 mb-4">Aktivite Akışı</h1>
        <div className="mb-3 grid grid-cols-12 gap-2">
          <input className="col-span-12 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tümü" />
          <input className="col-span-6 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Kişi Seç" />
          <input className="col-span-6 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tarih Aralığı Seç" />
        </div>
        <ol className="relative border-l border-gray-200 ml-2 max-h-[70vh] overflow-y-auto pr-1">
          {items.map((it, idx) => (
            <li key={idx} className="mb-5 ml-4">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-500 border border-white" />
              <time className="block text-xs text-gray-500 mb-1">
                {it.ts.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: undefined })}
              </time>
              {it.title ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{it.title}</p>
                  {it.meta && (
                    <div className="mt-1 text-xs text-gray-700 space-y-0.5">
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
                <p className="text-sm text-gray-800">{it.text}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}


