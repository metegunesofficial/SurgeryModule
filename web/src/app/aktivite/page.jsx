import { useMemo } from "react";
import { useSterilizationStore } from "@/stores/sterilization";
import ActivityFeedCard from "@/components/dashboard/ActivityFeedCard.jsx";

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
        <ActivityFeedCard items={items} fixedHeight={480} />
      </div>
    </div>
  );
}


