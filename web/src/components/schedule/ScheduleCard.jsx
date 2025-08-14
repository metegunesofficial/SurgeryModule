import { useMemo, useRef, useState, useEffect } from 'react';

function minutesSinceMidnight(d) {
  return d.getHours() * 60 + d.getMinutes();
}
function addMinutes(base, minutes) {
  const dt = new Date(base);
  dt.setMinutes(dt.getMinutes() + minutes);
  return dt;
}
function setTime(date, h, m) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function AppointmentModal({ open, onClose, onSave, initial, rooms, saveLabel = 'Kaydet' }) {
  const TYPE_OPTIONS = ['Diş çekimi', 'Kanal tedavisi', 'Dolgu', 'İmplant', 'Kontrol'];
  const [form, setForm] = useState(null);
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
        status: initial.status || 'Planlandı',
        note: initial.note || '',
        doctor_from: initial.doctor_from || 'Dr. Atilla',
        doctor_to: initial.doctor_to || 'Aslı Ataseven',
      });
    } else if (!open) {
      setForm(null);
    }
  }, [open, initial, rooms]);
  if (!open || !form) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`w-[680px] bg-white rounded-lg border border-gray-200 shadow-xl`}>
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-900">Randevu Oluştur / Düzenle</h3>
        </div>
        <div className="p-4 grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="col-span-6">
            <label className="block text-[11px] text-gray-500 mb-1">Oda/Ünite</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })}>
              {rooms?.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Süre (dk)</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}>
              {[15,30,45,60,90,120].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Tarih</label>
            <input type="date" className="w-full border rounded px-2 py-1 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Saat</label>
            <input type="time" className="w-full border rounded px-2 py-1 text-sm" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <div className="col-span-3">
            <label className="block text-[11px] text-gray-500 mb-1">Durum</label>
            <select className="w-full border rounded px-2 py-1 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Planlandı</option>
              <option>Tamamlandı</option>
              <option>İptal</option>
            </select>
          </div>
          <div className="col-span-12">
            <label className="block text-[11px] text-gray-500 mb-1">Açıklama</label>
            <textarea className="w-full border rounded px-2 py-1 text-sm" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
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
            });
          }}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function ScheduleCardShared({ title = 'Randevular', rooms, events, onEventsChange, scaleControls = true, scale, onScaleChange, settings = {}, date }) {
  const [localScale, setLocalScale] = useState(0.85);
  const effectiveScale = typeof scale === 'number' ? scale : localScale;
  const updateScale = (val) => {
    if (typeof onScaleChange === 'function') onScaleChange(val);
    else setLocalScale(val);
  };
  const [modal, setModal] = useState({ open: false, initial: null });
  const startHour = 8;
  const endHour = 20;
  const totalMinutes = (endHour - startHour) * 60;
  const hours = useMemo(() => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i), []);
  const scrollRef = useRef(null);
  const gridRef = useRef(null);
  const rowHeight = Math.max(28, Math.round(64 * effectiveScale));
  const show30 = effectiveScale >= 1.05;
  const show15 = effectiveScale >= 1.2;
  const leftColWidthPx = 64;
  const minutesPerPixel = 60 / rowHeight;

  const [drag, setDrag] = useState(null);
  const moveRef = useRef(null);
  const rafRef = useRef(0);
  const clickGuardUntilRef = useRef(0);
  const pendingDragRef = useRef(null);
  const wasDraggingRef = useRef(false);
  const DRAG_START_THRESHOLD_PX = 4;
  const dragRef = useRef(null);
  useEffect(() => { dragRef.current = drag; }, [drag]);

  const getSnapStep = () => {
    const cfg = settings?.slotSnapMinutes;
    if (typeof cfg === 'number' && cfg > 0) return cfg;
    if (show15) return 5; // high zoom, fine control
    if (show30) return 10; // mid zoom
    return 15; // low zoom
  };

  useEffect(() => {
    if (drag) {
      const prev = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
      return () => {
        document.body.style.userSelect = prev;
      };
    }
  }, [drag]);

  useEffect(() => {
    const updateFromMove = (ev) => {
      if (!dragRef.current && !pendingDragRef.current) return;
      const gridEl = gridRef.current;
      const scrollEl = scrollRef.current;
      if (!gridEl || !scrollEl) return;
      const rect = gridEl.getBoundingClientRect();
      const y = (ev.touches ? ev.touches[0].clientY : ev.clientY) - rect.top + scrollEl.scrollTop;
      const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
      const totalHeightPx = rowHeight * (endHour - startHour);
      const clampedY = Math.max(0, Math.min(totalHeightPx, y));
      const minutesFromTop = (clampedY / totalHeightPx) * totalMinutes;
      const step = getSnapStep();
      const snappedMin = Math.max(0, Math.min(totalMinutes, Math.round(minutesFromTop / step) * step));
      const innerWidth = rect.width - leftColWidthPx;
      const colWidth = Math.max(1, innerWidth / Math.max(1, rooms.length));
      const colIndex = Math.max(0, Math.min(rooms.length - 1, Math.floor((x - leftColWidthPx) / colWidth)));
      const room_id = rooms[colIndex] || rooms[0];

      // If we have a pending drag (from mousedown) and haven't officially started dragging yet,
      // promote it to an active drag only when the pointer travels beyond a small threshold.
      if (!drag && pendingDragRef.current) {
        const py = (ev.touches ? ev.touches[0].clientY : ev.clientY);
        const px = (ev.touches ? ev.touches[0].clientX : ev.clientX);
        const dy = Math.abs(py - pendingDragRef.current.startClientY);
        const dx = Math.abs(px - pendingDragRef.current.startClientX);
        if (Math.max(dx, dy) > DRAG_START_THRESHOLD_PX) {
          const pd = pendingDragRef.current;
          pendingDragRef.current = null;
          wasDraggingRef.current = true;
          // seed drag state using pending data
          const durationMin = (pd.originalEnd - pd.originalStart) / 60000;
          const start = new Date(pd.dayStart);
          const startMin = Math.max(0, Math.min(totalMinutes - durationMin, snappedMin - (pd.offsetMin || 0)));
          start.setMinutes(start.getMinutes() + startMin);
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + durationMin);
          setDrag({
            mode: 'move',
            eventId: pd.eventId,
            originalStart: pd.originalStart,
            originalEnd: pd.originalEnd,
            originalRoomId: pd.originalRoomId,
            dayStart: pd.dayStart,
            offsetMin: pd.offsetMin,
            preview: { start, end, room_id },
          });
          return; // next RAF tick will continue updating
        }
        return; // not enough movement yet; keep waiting
      }
      const d = dragRef.current;
      if (!d) return;
      if (d.mode === 'move') {
        const durationMin = (d.originalEnd - d.originalStart) / 60000;
        // keep initial pointer offset inside the event
        const startMin = Math.max(0, Math.min(totalMinutes - durationMin, snappedMin - (d.offsetMin || 0)));
        const start = new Date(d.dayStart);
        start.setMinutes(start.getMinutes() + startMin);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + durationMin);
        setDrag((d) => ({ ...d, preview: { start, end, room_id } }));
      } else if (d.mode === 'resize-start') {
        const end = new Date(d.originalEnd);
        let start = new Date(d.dayStart);
        start.setMinutes(start.getMinutes() + snappedMin);
        if (end - start < 15 * 60000) {
          start = new Date(end.getTime() - 15 * 60000);
        }
        setDrag((d) => ({ ...d, preview: { start, end, room_id: d.originalRoomId } }));
      } else if (d.mode === 'resize-end') {
        const start = new Date(d.originalStart);
        let end = new Date(d.dayStart);
        end.setMinutes(end.getMinutes() + snappedMin);
        if (end - start < 15 * 60000) {
          end = new Date(start.getTime() + 15 * 60000);
        }
        setDrag((d) => ({ ...d, preview: { start, end, room_id: d.originalRoomId } }));
      }
    };
    const onMove = (ev) => {
      moveRef.current = ev;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          if (moveRef.current) updateFromMove(moveRef.current);
        });
      }
      ev.preventDefault();
    };
    const onUp = () => {
      if (drag && drag.preview) {
        const updated = events.map((e) => (e.id === drag.eventId ? { ...e, ...drag.preview } : e));
        onEventsChange?.(updated);
      }
      if (wasDraggingRef.current) {
        // prevent click after drag
        clickGuardUntilRef.current = Date.now() + 200;
      }
      setDrag(null);
      wasDraggingRef.current = false;
      pendingDragRef.current = null;
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drag, rooms, events, onEventsChange, rowHeight, totalMinutes, endHour, startHour]);

  const save = (data) => {
    const exists = events.find((e) => e.id === data.id);
    const next = exists ? events.map((e) => (e.id === data.id ? { ...e, ...data } : e)) : [...events, { ...data }];
    onEventsChange?.(next);
    setModal({ open: false, initial: null });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex flex-col" style={{ height: 'clamp(320px, 55vh, 480px)' }}>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
      {scaleControls && (
      <div className="mb-2 flex flex-wrap items-center gap-1 min-w-0">
          <button className="px-2 py-1 text-xs border rounded" onClick={() => updateScale(Math.max(0.8, +(effectiveScale - 0.1).toFixed(2)))}>-</button>
          <input aria-label="Yakınlaştırma" type="range" min="0.8" max="1.4" step="0.05" value={effectiveScale} onChange={(e) => updateScale(parseFloat(e.target.value))} />
          <button className="px-2 py-1 text-xs border rounded" onClick={() => updateScale(Math.min(1.4, +(effectiveScale + 0.1).toFixed(2)))}>+</button>
        </div>
      )}
      <div className="relative overflow-y-auto rounded-md border flex-1 min-h-0" ref={scrollRef}>
        <div ref={gridRef} className="min-w-0">
          <div className="grid" style={{ gridTemplateColumns: `4rem repeat(${rooms.length}, minmax(0, 1fr))` }}>
            <div />
            {rooms.map((r) => (
              <div
                key={r}
                className="px-2 pb-2 text-[11px] sm:text-sm font-semibold text-gray-800 text-center"
              >
                {r}
              </div>
            ))}
            <div className="col-span-1 select-none">
              {hours.map((h, idx) => (
                <div key={h} className="relative text-[10px] sm:text-[11px] text-gray-500" style={{ height: rowHeight }}>
                  <div className="absolute -top-2 right-1">{`${String(h).padStart(2, '0')}:00`}</div>
                  {idx < hours.length - 1 && <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-200" />}
                  {show15 && <div className="absolute left-0 right-0 top-1/4 border-t border-gray-100" />}
                  {show30 && <div className="absolute left-0 right-0 top-1/2 border-t border-gray-100" />}
                  {show15 && <div className="absolute left-0 right-0 top-3/4 border-t border-gray-100" />}
                  {show15 && <div className="absolute right-1 -translate-y-1/2 top-1/4 text-[9px] sm:text-[10px] text-gray-400">{`${String(h).padStart(2, '0')}:15`}</div>}
                  {show30 && <div className="absolute right-1 -translate-y-1/2 top-1/2 text-[9px] sm:text-[10px] text-gray-400">{`${String(h).padStart(2, '0')}:30`}</div>}
                  {show15 && <div className="absolute right-1 -translate-y-1/2 top-3/4 text-[9px] sm:text-[10px] text-gray-400">{`${String(h).padStart(2, '0')}:45`}</div>}
                </div>
              ))}
            </div>
            {rooms.map((room) => (
              <div key={room} className="relative border-l border-gray-100">
                {hours.map((h) => (
                  <div key={h} className="relative border-t border-dashed border-gray-100" style={{ height: rowHeight }}>
                    {show15 && <div className="absolute left-0 right-0 top-1/4 border-t border-gray-100" />}
                    {show30 && <div className="absolute left-0 right-0 top-1/2 border-t border-gray-100" />}
                    {show15 && <div className="absolute left-0 right-0 top-3/4 border-t border-gray-100" />}
                  </div>
                ))}
                <div className="absolute inset-0">
                  {/* Now indicator */}
                  {(() => {
                    if (!date) return null;
                    const isToday = new Date(date).toDateString() === new Date().toDateString();
                    if (!isToday) return null;
                    const now = new Date();
                    const min = Math.max(0, minutesSinceMidnight(now) - startHour * 60);
                    const topPct = Math.max(0, Math.min(100, (min / totalMinutes) * 100));
                    const lineH = Math.max(0, Number(settings?.indicatorSizePx) || 0);
                    if (lineH <= 0) return null;
                    return (
                      <div className="absolute left-0 right-0" style={{ top: `${topPct}%` }}>
                        <div className="absolute left-0 right-0 bg-red-500/70" style={{ height: `${lineH}px`, transform: 'translateY(-50%)' }} />
                      </div>
                    );
                  })()}
                  {events.filter((e) => {
                    const isDraggingThis = !!(drag && drag.preview && drag.eventId === e.id);
                    if (isDraggingThis) {
                      // While dragging, render only in the previewed room, not the original
                      return drag.preview.room_id === room;
                    }
                    return e.room_id === room;
                  }).map((e) => {
                    const isDragging = drag && drag.eventId === e.id && drag.preview;
                    const startDate = isDragging ? drag.preview.start : e.start;
                    const endDate = isDragging ? drag.preview.end : e.end;
                    const startMin = Math.max(0, minutesSinceMidnight(startDate) - startHour * 60);
                    const endMin = Math.min(totalMinutes, minutesSinceMidnight(endDate) - startHour * 60);
                    const top = (startMin / totalMinutes) * 100;
                    const minTile = Math.max(12, Math.round(18 * effectiveScale));
                    const height = Math.max(minTile, ((endMin - startMin) / totalMinutes) * 100);
                    return (
                      <div key={e.id} className={`absolute left-1 right-1 sm:left-2 sm:right-2 rounded-md border shadow-sm bg-blue-50 border-blue-200 text-blue-800 ${drag ? 'cursor-grabbing' : 'cursor-move'} ${isDragging ? '' : 'transition-[top,height] duration-150 ease-out'}`} style={{ top: `${top}%`, height: `${height}%` }}
                        onMouseDown={(ev) => {
                          ev.stopPropagation();
                          const dayStart = new Date(startDate);
                          dayStart.setHours(startHour, 0, 0, 0);
                          const tileRect = ev.currentTarget.getBoundingClientRect();
                          const offsetPx = ev.clientY - tileRect.top;
                          const offsetMin = Math.round(offsetPx * minutesPerPixel);
                          // Defer starting a drag until pointer moves beyond threshold
                          pendingDragRef.current = {
                            eventId: e.id,
                            originalStart: e.start,
                            originalEnd: e.end,
                            originalRoomId: e.room_id,
                            dayStart,
                            offsetMin,
                            startClientX: ev.clientX,
                            startClientY: ev.clientY,
                          };
                        }}
                        onTouchStart={(ev) => {
                          ev.stopPropagation();
                          if (!ev.touches || ev.touches.length === 0) return;
                          const t = ev.touches[0];
                          const dayStart = new Date(startDate);
                          dayStart.setHours(startHour, 0, 0, 0);
                          const tileRect = ev.currentTarget.getBoundingClientRect();
                          const offsetPx = t.clientY - tileRect.top;
                          const offsetMin = Math.round(offsetPx * minutesPerPixel);
                          pendingDragRef.current = {
                            eventId: e.id,
                            originalStart: e.start,
                            originalEnd: e.end,
                            originalRoomId: e.room_id,
                            dayStart,
                            offsetMin,
                            startClientX: t.clientX,
                            startClientY: t.clientY,
                          };
                        }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (Date.now() < clickGuardUntilRef.current) return; // suppress click right after drag
                          setModal({ open: true, initial: e });
                        }}
                      >
                        <div className="absolute left-1 right-1 top-0 h-1.5 cursor-n-resize bg-transparent" onMouseDown={(ev) => {
                          ev.stopPropagation();
                          const dayStart = new Date(startDate);
                          dayStart.setHours(startHour, 0, 0, 0);
                          setDrag({ mode: 'resize-start', eventId: e.id, originalStart: e.start, originalEnd: e.end, originalRoomId: e.room_id, dayStart, preview: { start: startDate, end: endDate, room_id: e.room_id } });
                        }} onTouchStart={(ev) => {
                          ev.stopPropagation();
                          const dayStart = new Date(startDate);
                          dayStart.setHours(startHour, 0, 0, 0);
                          setDrag({ mode: 'resize-start', eventId: e.id, originalStart: e.start, originalEnd: e.end, originalRoomId: e.room_id, dayStart, preview: { start: startDate, end: endDate, room_id: e.room_id } });
                        }} />
                        <div className="absolute left-1 right-1 bottom-0 h-1.5 cursor-s-resize bg-transparent" onMouseDown={(ev) => {
                          ev.stopPropagation();
                          const dayStart = new Date(startDate);
                          dayStart.setHours(startHour, 0, 0, 0);
                          setDrag({ mode: 'resize-end', eventId: e.id, originalStart: e.start, originalEnd: e.end, originalRoomId: e.room_id, dayStart, preview: { start: startDate, end: endDate, room_id: e.room_id } });
                        }} onTouchStart={(ev) => {
                          ev.stopPropagation();
                          const dayStart = new Date(startDate);
                          dayStart.setHours(startHour, 0, 0, 0);
                          setDrag({ mode: 'resize-end', eventId: e.id, originalStart: e.start, originalEnd: e.end, originalRoomId: e.room_id, dayStart, preview: { start: startDate, end: endDate, room_id: e.room_id } });
                        }} />
                        <div className="px-1.5 sm:px-2 py-1 select-none">
                          <div className="truncate" style={{ fontSize: `${Number(settings?.fontSizePx || 12)}px`, fontWeight: Number(settings?.fontWeight || 500) }}>{e.label}</div>
                          <div className="opacity-90" style={{ fontSize: `${Math.max(9, Math.round((Number(settings?.fontSizePx || 12)) - 1))}px` }}>
                            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {settings?.showDoctor && (e.doctor_from || e.doctor_to) && (
                            <div className="text-blue-900/80" style={{ fontSize: `${Math.max(8, Math.round((Number(settings?.fontSizePx || 12)) - 2))}px` }}>
                              {(e.doctor_from || '') + (e.doctor_to ? ` → ${e.doctor_to}` : '')}
                            </div>
                          )}
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
    </div>
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

function AgendaList({ events, onEvent }) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  return (
    <div className="overflow-y-auto rounded-md border" style={{ height: 'clamp(320px, 55vh, 480px)' }}>
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
  const start = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  return (
    <div className="overflow-y-auto rounded-md border" style={{ height: 'clamp(320px, 55vh, 480px)' }}>
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
    <div className="overflow-y-auto rounded-md border" style={{ height: 'clamp(320px, 55vh, 480px)' }}>
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

export function ScheduleModule({ surgeryRooms, surgeryEvents, setSurgeryEvents, sterileRooms, sterileEvents, setSterileEvents, settings }) {
  const [tab, setTab] = useState('surgery');
  const [view, setView] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState({ open: false, initial: null });
  const [scale, setScale] = useState(0.85);
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
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-xs border rounded" onClick={() => setScale((s) => Math.max(0.8, +(s - 0.1).toFixed(2)))}>-</button>
            <input aria-label="Yakınlaştırma" type="range" min="0.8" max="1.4" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
            <button className="px-2 py-1 text-xs border rounded" onClick={() => setScale((s) => Math.min(1.4, +(s + 0.1).toFixed(2)))}>+</button>
          </div>
          <button className={`px-3 py-1.5 text-xs rounded border ${view === 'day' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'}`} onClick={() => setView('day')}>Günlük</button>
          <button className={`px-3 py-1.5 text-xs rounded border ${view === 'week' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'}`} onClick={() => setView('week')}>Haftalık</button>
          <button className={`px-3 py-1.5 text-xs rounded border ${view === 'month' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'}`} onClick={() => setView('month')}>Aylık</button>
          <button className={`px-3 py-1.5 text-xs rounded border ${view === 'agenda' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'}`} onClick={() => setView('agenda')}>Ajanda</button>
        </div>
      </div>
      {view === 'day' && (
        <ScheduleCardShared title="" rooms={rooms} events={filteredEvents} scaleControls={false} scale={scale} onScaleChange={setScale} settings={settings} date={currentDate} onEventsChange={(next) => {
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


