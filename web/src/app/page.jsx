import { useMemo, useRef, useState, useEffect } from "react";
import { useSurgeryPlanningStore } from "@/stores/surgeryPlanning";
import { useSterilizationStore } from "@/stores/sterilization";

function minutesSinceMidnight(d) {
  return d.getHours() * 60 + d.getMinutes();
}

function addMinutes(base, minutes) {
  const d = new Date(base);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function setTime(date, h, m) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function DayCalendar({
  title,
  rooms,
  events,
  startHour = 8,
  endHour = 20,
  variant = "card",
}) {
  const totalMinutes = (endHour - startHour) * 60;
  const hours = useMemo(() => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i), [startHour, endHour]);

  const content = (
    <>
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid" style={{ gridTemplateColumns: `4rem repeat(${rooms.length}, minmax(0, 1fr))` }}>
            {/* Header */}
            <div />
            {rooms.map((r) => (
              <div key={r} className="px-2 pb-2 text-xs font-medium text-gray-600">{r}</div>
            ))}
            {/* Body */}
            <div className="col-span-1">
              {hours.map((h, idx) => (
                <div key={h} className="relative h-16 text-[11px] text-gray-500">
                  <div className="absolute -top-2 right-1">{`${String(h).padStart(2, "0")}:00`}</div>
                  {idx < hours.length - 1 && <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-200" />}
                </div>
              ))}
              </div>
            {rooms.map((room) => (
              <div key={room} className="relative border-l border-gray-100">
                {/* Hour grid lines */}
                {hours.map((h, idx) => (
                  <div key={h} className="h-16 border-t border-dashed border-gray-100" />
                ))}
                {/* Events */}
                <div className="absolute inset-0">
                  {events
                    .filter((e) => e.room_id === room)
                    .map((e) => {
                      const startMin = Math.max(0, minutesSinceMidnight(e.start) - startHour * 60);
                      const endMin = Math.min(totalMinutes, minutesSinceMidnight(e.end) - startHour * 60);
                      const top = (startMin / totalMinutes) * 100;
                      const height = Math.max(18, ((endMin - startMin) / totalMinutes) * 100);
                      const typeColor = {
                        'Diş çekimi': 'bg-rose-100 border-rose-200 text-rose-800',
                        'Kanal tedavisi': 'bg-indigo-100 border-indigo-200 text-indigo-800',
                        'Dolgu': 'bg-amber-100 border-amber-200 text-amber-800',
                        'İmplant': 'bg-emerald-100 border-emerald-200 text-emerald-800',
                        'Kontrol': 'bg-sky-100 border-sky-200 text-sky-800',
                      }[e.type];
                      const color = typeColor ?? (
                        e.status === "in_progress"
                          ? "bg-blue-100 border-blue-200 text-blue-800"
                          : e.status === "completed"
                          ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                          : e.status === "cancelled"
                          ? "bg-red-100 border-red-200 text-red-800"
                          : "bg-amber-100 border-amber-200 text-amber-800"
                      );
                      return (
                        <div
                          key={e.id}
                          className={`absolute left-2 right-2 rounded-md border shadow-sm ${color}`}
                          style={{ top: `${top}%`, height: `${height}%` }}
                        >
                          <div className="px-2 py-1">
                            <div className="text-[11px] font-medium truncate">{e.label}</div>
                            <div className="text-[10px] opacity-90">
                              {e.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              {" - "}
                              {e.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
                  </div>
                </div>
              </div>
    </>
  );

  if (variant === "embedded") {
    return <div>{content}</div>;
  }
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">{content}</div>
  );
}

const mockUsers = [
  { id: 'u1', name: 'Dr. Atilla', email: 'atilla@altaydental.com' },
  { id: 'u2', name: 'Aslı Ataseven', email: 'asli@altaydental.com' },
  { id: 'u3', name: 'Mehmet Işlek', email: 'mehmet@altaydental.com' },
];

function UserBadge({ userId }) {
  const u = mockUsers.find((x) => x.id === userId);
  const initials = u?.name?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('') || '?';
  return (
                <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
        {initials}
                </div>
      <span className="text-xs text-gray-700">{u?.name || 'Atanmadı'}</span>
              </div>
  );
}

function UrgencyChip({ level }) {
  const styles = {
    Düşük: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Orta: 'bg-amber-50 text-amber-700 border-amber-200',
    Yüksek: 'bg-orange-50 text-orange-700 border-orange-200',
    Kritik: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`text-[10px] border rounded px-2 py-0.5 ${styles[level] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {level || 'Belirsiz'}
    </span>
  );
}

// Helpers for calendar views
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function endOfWeek(d) {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}
function daysInMonthGrid(d) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(first);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}

function AppointmentModal({ open, onClose, onSave, initial, rooms }) {
  const [form, setForm] = useState(() => {
    if (!initial) return null;
    return {
      title: initial.label || '',
      room_id: initial.room_id || (rooms?.[0] || ''),
      date: initial.start ? initial.start.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      time: initial.start ? initial.start.toTimeString().slice(0, 5) : '09:00',
      duration: (() => {
        const raw = Math.max(15, Math.round((((initial.end - initial.start) / 60000) || 60)));
        const allowed = [15, 30, 45, 60, 90, 120];
        return allowed.reduce((prev, curr) => (Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev), allowed[0]);
      })(),
      type: initial.type || 'Diş çekimi',
      status: initial.status || 'Bekleniyor',
      note: initial.note || '',
      doctor_from: initial.doctor_from || 'Aslı Ataseven',
      doctor_to: initial.doctor_to || 'Mehmet Işlek',
      sms: initial.sms ?? true,
    };
  });

  // Opening animation state
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => {
        cancelAnimationFrame(id);
        setAnimateIn(false);
      };
    }
    setAnimateIn(false);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && initial) {
      setForm({
        title: initial.label || '',
        room_id: initial.room_id || (rooms?.[0] || ''),
        date: initial.start ? initial.start.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        time: initial.start ? initial.start.toTimeString().slice(0, 5) : '09:00',
        duration: (() => {
          const raw = Math.max(15, Math.round((((initial.end - initial.start) / 60000) || 60)));
          const allowed = [15, 30, 45, 60, 90, 120];
          return allowed.reduce((prev, curr) => (Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev), allowed[0]);
        })(),
        type: initial.type || 'Diş çekimi',
        status: initial.status || 'Bekleniyor',
        note: initial.note || '',
        doctor_from: initial.doctor_from || 'Aslı Ataseven',
        doctor_to: initial.doctor_to || 'Mehmet Işlek',
        sms: initial.sms ?? true,
      });
    }
  }, [open, initial, rooms]);
  if (!open || !form) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`w-[680px] bg-white rounded-lg border border-gray-200 shadow-xl transform transition-[opacity,transform,box-shadow] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-text ${animateIn ? 'opacity-100 scale-100 translate-y-0 shadow-2xl' : 'opacity-0 scale-95 translate-y-2 shadow-md'}`}>
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-900">Randevu Oluştur / Düzenle</h3>
        </div>
        <div className="p-4 grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Başlık" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
          <div className="col-span-12">
            <label className="text-[11px] text-gray-500">Doktor / Asistan</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Doktor</label>
                <select className="w-full border rounded px-2 py-1 text-sm" value={form.doctor_from}
                  onChange={(e) => setForm({ ...form, doctor_from: e.target.value })}>
                  {mockUsers.map((u) => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Asistan</label>
                <select className="w-full border rounded px-2 py-1 text-sm" value={form.doctor_to}
                  onChange={(e) => setForm({ ...form, doctor_to: e.target.value })}>
                  {mockUsers.map((u) => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <label className="block text-[11px] text-gray-500 mb-1">Oda/Ünite</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.room_id}
              onChange={(e) => setForm({ ...form, room_id: e.target.value })}>
              {rooms?.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="col-span-6">
            <label className="block text-[11px] text-gray-500 mb-1">Tür</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['Diş çekimi','Kanal tedavisi','Dolgu','İmplant','Kontrol'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Süre (dk)</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}>
              {[15,30,45,60,90,120].map((m)=> (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Tarih</label>
            <input type="date" className="w-full border rounded px-2 py-1 text-sm" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Saat</label>
            <input type="time" className="w-full border rounded px-2 py-1 text-sm" value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })} />
                      </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Durum</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Bekleniyor</option>
              <option>Planlandı</option>
              <option>Tamamlandı</option>
              <option>İptal</option>
            </select>
                    </div>
          <div className="col-span-12">
            <label className="block text-[11px] text-gray-500 mb-1">Açıklama</label>
            <textarea className="w-full border rounded px-2 py-1 text-sm" rows={3} value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })} />
                  </div>
          <div className="col-span-12 flex items-center gap-2">
            <input id="sms" type="checkbox" checked={!!form.sms} onChange={(e) => setForm({ ...form, sms: e.target.checked })} />
            <label htmlFor="sms" className="text-sm">Randevu SMS'i gönderilsin mi?</label>
                      </div>
                    </div>
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200" onClick={onClose}>İptal</button>
          <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => {
            const [hh, mm] = String(form.time || '09:00').split(':').map(Number);
            const start = new Date(form.date + 'T00:00:00');
            start.setHours(hh, mm, 0, 0);
            const end = addMinutes(start, Number(form.duration) || 60);
            onSave({
              ...initial,
              label: form.title || 'Randevu',
              room_id: form.room_id,
              start,
              end,
              status: form.status,
              note: form.note,
              type: form.type,
              doctor_from: form.doctor_from,
              doctor_to: form.doctor_to,
              sms: form.sms,
            });
          }}>Oluştur</button>
                  </div>
                      </div>
                    </div>
  );
}

function InteractiveSchedule({ rooms, events, onChange, startHour = 8, endHour = 20, scale = 1 }) {
  const totalMinutes = (endHour - startHour) * 60;
  const hours = useMemo(() => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i), [startHour, endHour]);
  const scrollRef = useRef(null);
  const gridRef = useRef(null);
  const [modal, setModal] = useState({ open: false, initial: null });
  const rowHeight = Math.max(28, Math.round(64 * scale));
  const leftColWidthPx = 64; // 4rem

  const openCreateAt = (clientX, clientY) => {
    const gridEl = gridRef.current;
    const scrollEl = scrollRef.current;
    if (!gridEl || !scrollEl) return;
    const rect = gridEl.getBoundingClientRect();
    const y = clientY - rect.top + scrollEl.scrollTop;
    const x = clientX - rect.left;
    const minutesFromTop = Math.max(0, Math.min(totalMinutes, (y / (rowHeight * (endHour - startHour))) * totalMinutes));
    const start = addMinutes(setTime(new Date(), startHour, 0), Math.round(minutesFromTop / 5) * 5);
    const innerWidth = rect.width - leftColWidthPx;
    const colWidth = Math.max(1, innerWidth / rooms.length);
    const colIndex = Math.max(0, Math.min(rooms.length - 1, Math.floor((x - leftColWidthPx) / colWidth)));
    const room_id = rooms[colIndex] || rooms[0];
    setModal({ open: true, initial: { id: `n${Date.now()}`, room_id, label: '', start, end: addMinutes(start, 60), status: 'Planlandı' } });
  };

  const save = (data) => {
    const exists = events.find((e) => e.id === data.id);
    if (exists) {
      onChange(events.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
    } else {
      onChange([...events, { ...data }]);
    }
    setModal({ open: false, initial: null });
  };

  return (
    <div className="relative h-96 overflow-y-auto rounded-md border" ref={scrollRef}>
      <div ref={gridRef} className="min-w-[720px]">
        <div className="grid" style={{ gridTemplateColumns: `4rem repeat(${rooms.length}, minmax(0, 1fr))` }}>
          <div />
          {rooms.map((r) => (
            <div key={r} className="px-2 pb-2 text-xs font-medium text-gray-600">{r}</div>
          ))}
          <div className="col-span-1 select-none">
            {hours.map((h, idx) => (
              <div key={h} className="relative text-[11px] text-gray-500" style={{ height: rowHeight }}>
                <div className="absolute -top-2 right-1">{`${String(h).padStart(2, '0')}:00`}</div>
                {idx < hours.length - 1 && <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-200" />}
              </div>
            ))}
          </div>
          {rooms.map((room) => (
            <div key={room} className="relative border-l border-gray-100">
              {hours.map((h) => (
                <div key={h} className="border-t border-dashed border-gray-100" style={{ height: rowHeight }} />
              ))}
              <div
                className="absolute inset-0"
                onClick={(e) => openCreateAt(e.clientX, e.clientY)}
              >
                {events.filter((e) => e.room_id === room).map((e) => {
                  const startMin = Math.max(0, minutesSinceMidnight(e.start) - startHour * 60);
                  const endMin = Math.min(totalMinutes, minutesSinceMidnight(e.end) - startHour * 60);
                  const top = (startMin / totalMinutes) * 100;
                  const minTile = Math.max(12, Math.round(18 * scale));
                  const height = Math.max(minTile, ((endMin - startMin) / totalMinutes) * 100);
                  const labelCls = scale < 0.9 ? 'text-[10px]' : 'text-[11px]';
                  const timeCls = scale < 0.9 ? 'text-[9px]' : 'text-[10px]';
                  const padCls = scale < 0.9 ? 'px-1 py-0.5' : 'px-2 py-1';
                  const typeColor = {
                    'Diş çekimi': 'bg-rose-100 border-rose-200 text-rose-800',
                    'Kanal tedavisi': 'bg-indigo-100 border-indigo-200 text-indigo-800',
                    'Dolgu': 'bg-amber-100 border-amber-200 text-amber-800',
                    'İmplant': 'bg-emerald-100 border-emerald-200 text-emerald-800',
                    'Kontrol': 'bg-sky-100 border-sky-200 text-sky-800',
                  }[e.type];
                  const color = typeColor ?? (e.status === 'in_progress' ? 'bg-blue-100 border-blue-200 text-blue-800' : e.status === 'completed' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : e.status === 'cancelled' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-amber-100 border-amber-200 text-amber-800');
                  return (
                        <div
                      key={e.id}
                          className={`absolute left-2 right-2 rounded-md border shadow-sm ${color} cursor-pointer transition duration-150 hover:shadow-md active:scale-95`}
                      style={{ top: `${top}%`, height: `${height}%` }}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setModal({ open: true, initial: e });
                      }}
                    >
                      <div className={`${padCls}`}>
                        <div className={`${labelCls} font-medium truncate`}>{e.label}</div>
                        <div className={`${timeCls} opacity-90`}>
                          {e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {e.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AppointmentModal open={modal.open} onClose={() => setModal({ open: false, initial: null })} onSave={save} initial={modal.initial} rooms={rooms} />
    </div>
  );
}

function AgendaList({ events, onEvent }) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  return (
    <div className="h-96 overflow-y-auto rounded-md border">
      <ul className="divide-y">
        {sorted.map((e) => (
          <li key={e.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => onEvent?.(e)}>
            <div className="text-sm font-medium text-gray-900">{e.label}</div>
            <div className="text-xs text-gray-600">
              {e.start.toLocaleDateString()} {e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {e.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500">{e.room_id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WeekAgenda({ date, events, onDayClick, onEvent }) {
  // Render a week as a 7-day grid similar to MonthGrid
  const start = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  return (
    <div className="h-96 overflow-y-auto rounded-md border">
      <div className="grid grid-cols-7 border-b text-xs text-gray-500">
        {['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map((d) => (
          <div key={d} className="px-2 py-1 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const dayEvents = events.filter((e) => isSameDay(e.start, d));
          const visible = dayEvents.slice(0, 3);
          return (
            <div
              key={d.toISOString()}
              className="h-24 border -mt-px -ml-px p-1 bg-white"
              onClick={() => onDayClick?.(d)}
            >
              <div className="text-[11px] text-gray-500 mb-1">{d.getDate()}</div>
              <div className="space-y-1">
                {visible.map((e) => (
                  <div
                    key={e.id}
                    className="text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-700 truncate cursor-pointer"
                    onClick={(ev) => { ev.stopPropagation(); onEvent?.(e); }}
                  >
                    {e.label}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-gray-400">…</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthGrid({ date, events, onDayClick, onEvent }) {
  const days = daysInMonthGrid(date);
  return (
    <div className="h-96 overflow-y-auto rounded-md border">
      <div className="grid grid-cols-7 border-b text-xs text-gray-500">
        {['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map((d) => (
          <div key={d} className="px-2 py-1 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const inMonth = d.getMonth() === date.getMonth();
          const dayEvents = events.filter((e) => isSameDay(e.start, d)).slice(0, 3);
          return (
            <div key={d.toISOString()} className={`h-24 border -mt-px -ml-px p-1 ${inMonth ? 'bg-white' : 'bg-gray-50'}`} onClick={() => onDayClick?.(d)}>
              <div className="text-[11px] text-gray-500 mb-1">{d.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.map((e) => (
                  <div key={e.id} className="text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-700 truncate cursor-pointer" onClick={(ev) => { ev.stopPropagation(); onEvent?.(e); }}>{e.label}</div>
                ))}
                {events.filter((e) => isSameDay(e.start, d)).length > 3 && (
                  <div className="text-[10px] text-gray-400">…</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleCard({ surgeryRooms, surgeryEvents, setSurgeryEvents, sterileRooms, sterileEvents, setSterileEvents }) {
  const [tab, setTab] = useState('surgery');
  const [view, setView] = useState('day'); // 'day' | 'week' | 'month' | 'agenda'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scale, setScale] = useState(0.85);
  const [modal, setModal] = useState({ open: false, initial: null });
  const rooms = tab === 'surgery' ? surgeryRooms : sterileRooms;
  const events = tab === 'surgery' ? surgeryEvents : sterileEvents;
  const setEvents = tab === 'surgery' ? setSurgeryEvents : setSterileEvents;

  const filteredEvents = useMemo(() => {
    if (view === 'day') {
      return events.filter((e) => isSameDay(e.start, currentDate));
    }
    if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return events.filter((e) => e.start >= start && e.start <= end);
    }
    if (view === 'month') {
      const m = currentDate.getMonth();
      const y = currentDate.getFullYear();
      return events.filter((e) => e.start.getFullYear() === y && e.start.getMonth() === m);
    }
    // agenda
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return events.filter((e) => e.start >= start && e.start <= end);
  }, [events, view, currentDate]);

  const moveDate = (delta) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + delta);
    else if (view === 'week') d.setDate(d.getDate() + 7 * delta);
    else if (view === 'month') d.setMonth(d.getMonth() + delta);
    else d.setDate(d.getDate() + 7 * delta);
    setCurrentDate(d);
  };

  const saveFromModal = (data) => {
    const exists = events.find((e) => e.id === data.id);
    const next = exists ? events.map((e) => (e.id === data.id ? { ...e, ...data } : e)) : [...events, { ...data }];
    setEvents(next);
    setModal({ open: false, initial: null });
  };

  return (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Randevular</h2>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1.5 text-xs rounded border ${tab === 'surgery' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`} onClick={() => setTab('surgery')}>Ameliyathane</button>
          <button className={`px-3 py-1.5 text-xs rounded border ${tab === 'sterile' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`} onClick={() => setTab('sterile')}>Sterilizasyon</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 text-sm border rounded" onClick={() => moveDate(-1)}>‹</button>
          <input type="date" className="border rounded px-2 py-1 text-sm" value={currentDate.toISOString().slice(0,10)} onChange={(e) => setCurrentDate(new Date(e.target.value))} />
          <button className="px-2 py-1 text-sm border rounded" onClick={() => moveDate(1)}>›</button>
        </div>
        <div className="flex items-center gap-2">
          {['day','week','month','agenda'].map((v) => (
            <button key={v} className={`px-3 py-1.5 text-xs rounded border ${view === v ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'}`} onClick={() => setView(v)}>
              {v === 'day' ? 'Günlük' : v === 'week' ? 'Haftalık' : v === 'month' ? 'Aylık' : 'Ajanda'}
            </button>
          ))}
          {view === 'day' && (
            <div className="ml-2 flex items-center gap-1">
              <button className="px-2 py-1 text-xs border rounded" onClick={() => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2)))}>-</button>
              <input type="range" min="0.6" max="1.4" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
              <button className="px-2 py-1 text-xs border rounded" onClick={() => setScale((s) => Math.min(1.4, +(s + 0.1).toFixed(2)))}>+</button>
            </div>
          )}
        </div>
      </div>
      {view === 'day' && (
        <InteractiveSchedule rooms={rooms} events={filteredEvents} scale={scale} onChange={(next) => {
          // merge into original events array by id
          const nextIds = new Set(next.map((e) => e.id));
          const others = events.filter((e) => !nextIds.has(e.id));
          setEvents([...others, ...next]);
        }} />
      )}
      {view === 'week' && (
        <WeekAgenda date={currentDate} events={filteredEvents} onDayClick={(d) => { setCurrentDate(d); setView('day'); }} onEvent={(e) => setModal({ open: true, initial: e })} />
      )}
      {view === 'month' && (
        <MonthGrid date={currentDate} events={filteredEvents} onDayClick={(d) => { setCurrentDate(d); setView('day'); }} onEvent={(e) => setModal({ open: true, initial: e })} />
      )}
      {view === 'agenda' && (
        <AgendaList events={filteredEvents} onEvent={(e) => setModal({ open: true, initial: e })} />
      )}
      <AppointmentModal open={modal.open} onClose={() => setModal({ open: false, initial: null })} onSave={saveFromModal} initial={modal.initial} rooms={rooms} />
    </div>
  );
}

const BOTTOM_CARD_PX = 360;

function TaskList({ fixedHeight = BOTTOM_CARD_PX }) {
  const STORAGE_KEY_TASKS = 'dashboard_tasks';
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Bugünkü ameliyat setlerini doğrula', completed: false, urgency: 'Yüksek', assignedTo: 'u2', dueDate: new Date() },
    { id: 't2', title: 'Sterilizasyon döngüsü raporlarını kontrol et', completed: true, urgency: 'Orta', assignedTo: 'u1', dueDate: addMinutes(new Date(), 60 * 24) },
    { id: 't3', title: 'OR-2 ekipman bakım kaydı oluştur', completed: false, urgency: 'Düşük', assignedTo: 'u3', dueDate: addMinutes(new Date(), 60 * 48) },
  ]);
  // hydrate tasks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        const revived = Array.isArray(parsed) ? parsed.map((t) => ({ ...t, dueDate: t.dueDate ? new Date(t.dueDate) : new Date() })) : [];
        if (revived.length) setTasks(revived);
      }
    } catch {}
  }, []);
  // persist tasks
  useEffect(() => {
    try {
      const serializable = tasks.map((t) => ({ ...t, dueDate: (t.dueDate instanceof Date ? t.dueDate : new Date()).toISOString() }));
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(serializable));
    } catch {}
  }, [tasks]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: '', urgency: 'Orta', assignedTo: mockUsers[0].id });
  const [filters, setFilters] = useState({ text: '', priority: '', assignedTo: '', from: '', to: '' });
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesText = !filters.text || (t.title || '').toLowerCase().includes(filters.text.toLowerCase());
      const matchesPriority = !filters.priority || t.urgency === filters.priority;
      const matchesAssignee = !filters.assignedTo || t.assignedTo === filters.assignedTo;
      const d = t.dueDate instanceof Date ? t.dueDate : new Date();
      const fromOk = !filters.from || d >= new Date(filters.from + 'T00:00:00');
      const toOk = !filters.to || d <= new Date(filters.to + 'T23:59:59');
      return matchesText && matchesPriority && matchesAssignee && fromOk && toOk;
    });
  }, [tasks, filters]);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" style={{ height: fixedHeight }}>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Görevler</h2>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="grid grid-cols-12 gap-2 flex-1 mr-2">
          <input className="col-span-12 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tümü"
            value={filters.text}
            onChange={(e) => setFilters((f) => ({ ...f, text: e.target.value }))}
          />
          <select className="col-span-6 lg:col-span-3 border rounded px-2 py-1 text-sm" value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="">Öncelik (Tümü)</option>
            <option>Düşük</option>
            <option>Orta</option>
            <option>Yüksek</option>
            <option>Kritik</option>
          </select>
          <select className="col-span-6 lg:col-span-3 border rounded px-2 py-1 text-sm" value={filters.assignedTo}
            onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}
          >
            <option value="">Kişi (Tümü)</option>
            {mockUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <input type="date" className="col-span-6 lg:col-span-1 border rounded px-2 py-1 text-sm" value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          />
          <input type="date" className="col-span-6 lg:col-span-1 border rounded px-2 py-1 text-sm" value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </div>
        <a href="/gorevler" className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Tümünü Gör</a>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <button
          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            const nid = `t${Date.now()}`;
            setDraft({ title: '', urgency: 'Orta', assignedTo: mockUsers[0].id });
            setEditingId(nid);
            setTasks((prev) => [{ id: nid, title: '', completed: false, urgency: 'Orta', assignedTo: mockUsers[0].id, dueDate: new Date() }, ...prev]);
          }}
        >
          Yeni Görev
                  </button>
                </div>
      <ul className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: fixedHeight - 150 }}>
        {filteredTasks.map((task) => {
          const isEditing = editingId === task.id;
          return (
            <li key={task.id} className="flex items-start gap-3">
              <input
                id={task.id}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={task.completed}
                onChange={() =>
                  setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
                }
              />
              <div className="flex-1">
                {isEditing ? (
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12">
                      <input
                        autoFocus
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Görev açıklaması"
                        defaultValue={task.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      />
                  </div>
                    <div className="col-span-6">
                      <label className="block text-[11px] text-gray-500 mb-1">Aciliyet</label>
                      <select
                        className="w-full border rounded px-2 py-1 text-sm"
                        defaultValue={task.urgency}
                        onChange={(e) => setDraft((d) => ({ ...d, urgency: e.target.value }))}
                      >
                        <option>Düşük</option>
                        <option>Orta</option>
                        <option>Yüksek</option>
                        <option>Kritik</option>
                      </select>
                    </div>
                    <div className="col-span-6">
                      <label className="block text-[11px] text-gray-500 mb-1">Atanan</label>
                      <select
                        className="w-full border rounded px-2 py-1 text-sm"
                        defaultValue={task.assignedTo}
                        onChange={(e) => setDraft((d) => ({ ...d, assignedTo: e.target.value }))}
                      >
                        {mockUsers.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-12 flex gap-2 justify-end">
                      <button
                        className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() => {
                          // Revert creation if new and empty
                          if (task.title === '' && draft.title === '') {
                            setTasks((prev) => prev.filter((t) => t.id !== task.id));
                          }
                          setEditingId(null);
                        }}
                      >
                        İptal
                      </button>
                      <button
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => {
                          setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...draft, title: draft.title || t.title } : t)));
                          setEditingId(null);
                        }}
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <label htmlFor={task.id} className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title || 'Yeni görev'}
                      </label>
                      <div className="mt-1 flex items-center gap-3">
                        <UserBadge userId={task.assignedTo} />
                        <UrgencyChip level={task.urgency} />
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditingId(task.id)}>Düzenle</button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
                </div>
  );
}

function ActivityFeed({ items, fixedHeight = BOTTOM_CARD_PX }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" style={{ height: fixedHeight }}>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Genel Bakış (Aktivite Akışı)</h2>
      <div className="mb-3 flex items-center justify-between">
        <div className="grid grid-cols-12 gap-2 flex-1 mr-2">
          <input className="col-span-12 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tümü" />
          <input className="col-span-6 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Kişi Seç" />
          <input className="col-span-6 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tarih Aralığı Seç" />
        </div>
        <a href="/aktivite" className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Tümünü Gör</a>
      </div>
      <ol className="relative border-l border-gray-200 ml-2 overflow-y-auto pr-1" style={{ maxHeight: fixedHeight - 120 }}>
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
  );
}

export default function AtillaDentalDashboard() {
  const { cases } = useSurgeryPlanningStore();
  const { cycles, events: scanEvents } = useSterilizationStore();

  const today = new Date();
  const startOfDay = setTime(today, 8, 0);
  const STORAGE_KEY_SURGERY = 'dashboard_surgery_events';
  const STORAGE_KEY_STERILE = 'dashboard_sterile_events';

  const fallbackSurgeryRooms = ["OR-1", "OR-2", "OR-3"];
  const fallbackSurgeryEvents = useMemo(() => {
    return [
      { id: "s1", room_id: "OR-1", label: "Diş çekimi (A01)", type: 'Diş çekimi', start: addMinutes(startOfDay, 15), end: addMinutes(startOfDay, 75), status: "in_progress" },
      { id: "s2", room_id: "OR-2", label: "İmplant (B12)", type: 'İmplant', start: addMinutes(startOfDay, 90), end: addMinutes(startOfDay, 150), status: "planned" },
      { id: "s3", room_id: "OR-3", label: "Dolgu (C07)", type: 'Dolgu', start: addMinutes(startOfDay, 180), end: addMinutes(startOfDay, 240), status: "planned" },
      { id: "s4", room_id: "OR-1", label: "Kanal tedavisi (D21)", type: 'Kanal tedavisi', start: addMinutes(startOfDay, 270), end: addMinutes(startOfDay, 360), status: "planned" },
    ];
  }, [startOfDay]);

  const surgeryRooms = useMemo(() => {
    const rooms = Array.from(new Set(cases.map((c) => c.room_id)));
    return rooms.length ? rooms : fallbackSurgeryRooms;
  }, [cases]);

  const initialSurgeryEvents = useMemo(() => {
    if (cases.length === 0) return fallbackSurgeryEvents;
    return cases.map((c) => ({
      id: c.case_id,
      room_id: c.room_id,
      label: `${c.procedure_code}`,
      start: new Date(c.scheduled_start),
      end: addMinutes(new Date(c.scheduled_start), c.estimated_duration_min),
      status: c.status,
    }));
  }, [cases, fallbackSurgeryEvents]);
  const [surgeryEvents, setSurgeryEvents] = useState(initialSurgeryEvents);

  const fallbackSterileRooms = ["ST-1", "ST-2"];
  const fallbackSterileEvents = useMemo(() => {
    return [
      { id: "c1", room_id: "ST-1", label: "B Buhar Döngüsü", start: addMinutes(startOfDay, 30), end: addMinutes(startOfDay, 120), status: "in_progress" },
      { id: "c2", room_id: "ST-2", label: "Plazma Döngüsü", start: addMinutes(startOfDay, 150), end: addMinutes(startOfDay, 240), status: "planned" },
    ];
  }, [startOfDay]);

  const sterileRooms = useMemo(() => {
    const rooms = Array.from(new Set(cycles.map((cy) => cy.device_id)));
    return rooms.length ? rooms : fallbackSterileRooms;
  }, [cycles]);

  const initialSterileEvents = useMemo(() => {
    if (cycles.length === 0) return fallbackSterileEvents;
    return cycles.map((cy) => ({
      id: cy.cycle_id,
      room_id: cy.device_id,
      label: `${cy.type.toUpperCase()} (${cy.result.toUpperCase()})`,
      start: new Date(cy.start_time),
      end: new Date(cy.end_time),
      status: cy.result === "pass" ? "completed" : "cancelled",
    }));
  }, [cycles, fallbackSterileEvents]);
  const [sterileEvents, setSterileEvents] = useState(initialSterileEvents);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const rawS = localStorage.getItem(STORAGE_KEY_SURGERY);
      if (rawS) {
        const parsed = JSON.parse(rawS);
        const revived = Array.isArray(parsed) ? parsed.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })) : [];
        if (revived.length) setSurgeryEvents(revived);
      }
      const rawT = localStorage.getItem(STORAGE_KEY_STERILE);
      if (rawT) {
        const parsed = JSON.parse(rawT);
        const revived = Array.isArray(parsed) ? parsed.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })) : [];
        if (revived.length) setSterileEvents(revived);
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      const serializable = surgeryEvents.map((e) => ({ ...e, start: e.start.toISOString(), end: e.end.toISOString() }));
      localStorage.setItem(STORAGE_KEY_SURGERY, JSON.stringify(serializable));
    } catch {}
  }, [surgeryEvents]);
  useEffect(() => {
    try {
      const serializable = sterileEvents.map((e) => ({ ...e, start: e.start.toISOString(), end: e.end.toISOString() }));
      localStorage.setItem(STORAGE_KEY_STERILE, JSON.stringify(serializable));
    } catch {}
  }, [sterileEvents]);

  // Activity items (visual spec data + sterilization scan events)
  const activityItems = useMemo(() => {
    const now = new Date();
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
    const scanDerived = (scanEvents || []).slice(-3).map((e) => ({
      ts: new Date(e.ts),
      text: `${e.event_type} — Kit ${e.kit_id} @ ${e.location}`,
    }));
    const merged = [...visual, ...scanDerived];
    return merged.sort((a, b) => b.ts.getTime() - a.ts.getTime()).slice(0, 10);
  }, [scanEvents]);

                        return (
    <div className="grid grid-cols-12 gap-3 md:gap-4">
      {/* Top: Randevular */}
      <div className="col-span-12">
        <ScheduleCard
          surgeryRooms={surgeryRooms}
          surgeryEvents={surgeryEvents}
          setSurgeryEvents={setSurgeryEvents}
          sterileRooms={sterileRooms}
          sterileEvents={sterileEvents}
          setSterileEvents={setSterileEvents}
        />
                    </div>
      {/* Bottom: Left tasks, Right activity (equal height & alignment) */}
      <div className="col-span-12 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 flex">
          <div className="flex-1">
            <TaskList fixedHeight={BOTTOM_CARD_PX} />
                      </div>
                    </div>
        <div className="col-span-12 lg:col-span-6 flex">
          <div className="flex-1">
            <ActivityFeed items={activityItems} fixedHeight={BOTTOM_CARD_PX} />
                </div>
              </div>
            </div>
          </div>
  );
}
