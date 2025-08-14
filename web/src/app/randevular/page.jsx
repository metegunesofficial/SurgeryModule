import { useMemo, useState, useRef, useEffect } from 'react';
import { ScheduleModule } from '@/components/schedule/ScheduleCard.jsx';
import { ScheduleCardShared } from '@/components/schedule/ScheduleCard.jsx';

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

function AppointmentModal({ open, onClose, onSave, initial, rooms }) {
    const TYPE_OPTIONS = ['Diş çekimi', 'Kanal tedavisi', 'Dolgu', 'İmplant', 'Kontrol'];
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
			status: initial.status || 'Planlandı',
			note: initial.note || '',
			doctor_from: initial.doctor_from || 'Dr. Atilla',
			doctor_to: initial.doctor_to || 'Aslı Ataseven',
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
				status: initial.status || 'Planlandı',
				note: initial.note || '',
				doctor_from: initial.doctor_from || 'Dr. Atilla',
				doctor_to: initial.doctor_to || 'Aslı Ataseven',
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
					<div className="col-span-12">
						<label className="text-[11px] text-gray-500">Doktor / Asistan</label>
						<div className="grid grid-cols-2 gap-2">
							<div>
								<label className="block text-[11px] text-gray-500 mb-1">Doktor</label>
								<select className="w-full border rounded px-2 py-1 text-sm" value={form.doctor_from || ''} onChange={(e) => setForm({ ...form, doctor_from: e.target.value })}>
									{['Dr. Atilla','Aslı Ataseven','Mehmet Işlek'].map((n) => (
										<option key={n} value={n}>{n}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-[11px] text-gray-500 mb-1">Asistan</label>
								<select className="w-full border rounded px-2 py-1 text-sm" value={form.doctor_to || ''} onChange={(e) => setForm({ ...form, doctor_to: e.target.value })}>
									{['Dr. Atilla','Aslı Ataseven','Mehmet Işlek'].map((n) => (
										<option key={n} value={n}>{n}</option>
									))}
								</select>
							</div>
						</div>
					</div>
					<div className="col-span-3">
						<label className="block text-[11px] text-gray-500 mb-1">Süre (dk)</label>
						<select className="w-full border rounded px-2 py-1 text-sm" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}>
							{[15,30,45,60,90,120].map((m) => (
								<option key={m} value={m}>{m}</option>
							))}
						</select>
					</div>
            <div className="col-span-6">
                <label className="block text-[11px] text-gray-500 mb-1">Tür</label>
                <select className="w-full border rounded px-2 py-1 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
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
					}}>Kaydet</button>
				</div>
			</div>
		</div>
	);
}

export default function RandevularPage() {
    const today = new Date();
    const startOfDay = setTime(today, 8, 0);
    const STORAGE_KEY = 'appointments_surgery_events';
    const surgeryRooms = ['OR-1', 'OR-2', 'OR-3'];
    const [surgeryEvents, setSurgeryEvents] = useState([
        { id: 's1', room_id: 'OR-1', label: 'Diş çekimi (A01)', type: 'Diş çekimi', start: addMinutes(startOfDay, 15), end: addMinutes(startOfDay, 75), status: 'in_progress', doctor_from: 'Dr. Atilla', doctor_to: 'Aslı Ataseven' },
        { id: 's2', room_id: 'OR-2', label: 'İmplant (B12)', type: 'İmplant', start: addMinutes(startOfDay, 90), end: addMinutes(startOfDay, 150), status: 'planned', doctor_from: 'Dr. Atilla', doctor_to: 'Mehmet Işlek' },
        { id: 's3', room_id: 'OR-3', label: 'Dolgu (C07)', type: 'Dolgu', start: addMinutes(startOfDay, 180), end: addMinutes(startOfDay, 240), status: 'planned', doctor_from: 'Aslı Ataseven', doctor_to: 'Dr. Atilla' },
    ]);
    const [sterileRooms, setSterileRooms] = useState([]);
    const [sterileEvents, setSterileEvents] = useState([]);
    const SETTINGS_KEY = 'appointments_settings_v1';
    // Settings panel visibility: default hidden, no persistence
    const [settings, setSettings] = useState(() => {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (raw) return JSON.parse(raw);
        } catch {}
        return { fontSizePx: 12, fontWeight: 500, slotSnapMinutes: 10, indicatorSizePx: 2, showDoctor: false };
    });
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const revived = Array.isArray(parsed)
                    ? parsed.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
                    : [];
                if (revived.length) setSurgeryEvents(revived);
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            const serializable = surgeryEvents.map((e) => ({ ...e, start: e.start.toISOString(), end: e.end.toISOString() }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
        } catch {}
    }, [surgeryEvents]);

    useEffect(() => {
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {}
    }, [settings]);
    // not persisted by design

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h1 className="text-base font-semibold text-gray-900">Randevular</h1>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <div />
                    <button aria-label="Randevu ayarlarını aç/kapat" className="h-8 px-3 text-xs border rounded" onClick={() => setSettingsOpen((v) => !v)}>
                        {settingsOpen ? 'Ayarları Gizle' : 'Ayarları Göster'}
                    </button>
                </div>
                <div className="grid grid-cols-12 gap-3">
                    <div className={settingsOpen ? "col-span-12 lg:col-span-9" : "col-span-12"}>
                        <ScheduleModule
                            surgeryRooms={surgeryRooms}
                            surgeryEvents={surgeryEvents}
                            setSurgeryEvents={setSurgeryEvents}
                            sterileRooms={sterileRooms}
                            sterileEvents={sterileEvents}
                            setSterileEvents={setSterileEvents}
                            settings={settings}
                        />
                    </div>
                    {settingsOpen && (
                    <div className="col-span-12 lg:col-span-3">
                        <div className="sticky top-2 space-y-3 text-xs">
                            <div className="rounded-lg border p-2">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium">Yazı Boyutu</div>
                                    <div className="text-[11px] text-gray-500">{settings.fontSizePx}px</div>
                                </div>
                                <input className="w-full" type="range" min="10" max="20" step="1" value={settings.fontSizePx || 12} onChange={(e) => setSettings((s) => ({ ...s, fontSizePx: Number(e.target.value) }))} />
                            </div>
                            <div className="rounded-lg border p-2">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium">Yazı Kalınlığı</div>
                                    <div className="text-[11px] text-gray-500">{(settings.fontWeight||500) === 400 ? 'Normal' : (settings.fontWeight||500)}</div>
                                </div>
                                <input className="w-full" type="range" min="400" max="700" step="100" value={settings.fontWeight || 500} onChange={(e) => setSettings((s) => ({ ...s, fontWeight: Number(e.target.value) }))} />
                            </div>
                            <div className="rounded-lg border p-2">
                                <div className="font-medium mb-1">Slot Süresi (yakalama dk)</div>
                                <input className="w-full" type="range" min="5" max="30" step="5" value={settings.slotSnapMinutes || 10} onChange={(e) => setSettings((s) => ({ ...s, slotSnapMinutes: Number(e.target.value) }))} />
                            </div>
                            <div className="rounded-lg border p-2">
                                <div className="font-medium mb-1">Gösterge Boyutu (şimdi çizgisi)</div>
                                <input className="w-full" type="range" min="0" max="4" step="1" value={settings.indicatorSizePx || 2} onChange={(e) => setSettings((s) => ({ ...s, indicatorSizePx: Number(e.target.value) }))} />
                            </div>
                            <div className="rounded-lg border p-2 flex items-center justify-between">
                                <div className="font-medium">Doktoru Göster</div>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={!!settings.showDoctor} onChange={(e) => setSettings((s) => ({ ...s, showDoctor: e.target.checked }))} />
                                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                                </label>
                            </div>
                            <button className="h-8 px-3 border rounded text-blue-600" onClick={() => setSettings({ fontSizePx: 12, fontWeight: 500, slotSnapMinutes: 10, indicatorSizePx: 2, showDoctor: false })}>Varsayılan'a Sıfırla</button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}


