import { useMemo, useState, useRef, useEffect } from 'react';

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
                duration: Math.max(30, Math.round(((initial.end - initial.start) / 60000) || 60)),
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
	const rooms = ['OR-1', 'OR-2', 'OR-3'];
	const [events, setEvents] = useState([
		{ id: 's1', room_id: 'OR-1', label: 'Diş çekimi (A01)', type: 'Diş çekimi', start: addMinutes(startOfDay, 15), end: addMinutes(startOfDay, 75), status: 'in_progress' },
		{ id: 's2', room_id: 'OR-2', label: 'İmplant (B12)', type: 'İmplant', start: addMinutes(startOfDay, 90), end: addMinutes(startOfDay, 150), status: 'planned' },
		{ id: 's3', room_id: 'OR-3', label: 'Dolgu (C07)', type: 'Dolgu', start: addMinutes(startOfDay, 180), end: addMinutes(startOfDay, 240), status: 'planned' },
	]);

	// Hydrate from localStorage on mount
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				const revived = Array.isArray(parsed)
					? parsed.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
					: [];
				if (revived.length) setEvents(revived);
			}
		} catch {}
	}, []);

	// Persist to localStorage on change
	useEffect(() => {
		try {
			const serializable = events.map((e) => ({ ...e, start: e.start.toISOString(), end: e.end.toISOString() }));
			localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
		} catch {}
	}, [events]);
	const [modal, setModal] = useState({ open: false, initial: null });
	const scrollRef = useRef(null);
	const gridRef = useRef(null);
	const startHour = 8;
	const endHour = 20;
	const totalMinutes = (endHour - startHour) * 60;
	const hours = useMemo(() => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i), []);

	return (
		<div className="space-y-4">
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center justify-between gap-2 mb-3">
					<h1 className="text-base font-semibold text-gray-900">Randevular</h1>
					<a href="/" className="text-xs text-blue-600 hover:underline">Dashboard'a dön</a>
				</div>
				<div className="relative h-[520px] overflow-y-auto rounded-md border" ref={scrollRef}>
					<div ref={gridRef} className="min-w-[720px]">
						<div className="grid" style={{ gridTemplateColumns: `4rem repeat(${rooms.length}, minmax(0, 1fr))` }}>
							<div />
							{rooms.map((r) => (
								<div key={r} className="px-2 pb-2 text-xs font-medium text-gray-600">{r}</div>
							))}
							<div className="col-span-1">
								{hours.map((h, idx) => (
									<div key={h} className="relative text-[11px] text-gray-500 h-16">
										<div className="absolute -top-2 right-1">{`${String(h).padStart(2, '0')}:00`}</div>
										{idx < hours.length - 1 && <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-200" />}
									</div>
								))}
							</div>
							{rooms.map((room) => (
								<div key={room} className="relative border-l border-gray-100">
									{hours.map((h) => (
										<div key={h} className="border-t border-dashed border-gray-100 h-16" />
									))}
									<div className="absolute inset-0">
										{events.filter((e) => e.room_id === room).map((e) => {
											const startMin = Math.max(0, minutesSinceMidnight(e.start) - startHour * 60);
											const endMin = Math.min(totalMinutes, minutesSinceMidnight(e.end) - startHour * 60);
											const top = (startMin / totalMinutes) * 100;
											const height = Math.max(18, ((endMin - startMin) / totalMinutes) * 100);
                                            const color = e.status === 'in_progress' ? 'bg-blue-100 border-blue-200 text-blue-800' : e.status === 'completed' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : e.status === 'cancelled' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-amber-100 border-amber-200 text-amber-800';
								return (
												<div
													key={e.id}
                                        className={`absolute left-2 right-2 rounded-md border shadow-sm ${(() => {
											const typeColor = {
                                                'Diş çekimi': 'bg-rose-100 border-rose-200 text-rose-800',
                                                'Kanal tedavisi': 'bg-indigo-100 border-indigo-200 text-indigo-800',
                                                'Dolgu': 'bg-amber-100 border-amber-200 text-amber-800',
                                                'İmplant': 'bg-emerald-100 border-emerald-200 text-emerald-800',
                                                'Kontrol': 'bg-sky-100 border-sky-200 text-sky-800',
											};
											return typeColor[e.type] || color;
										})()} cursor-pointer transition duration-150 hover:shadow-md active:scale-95`}
													style={{ top: `${top}%`, height: `${height}%` }}
													onClick={() => setModal({ open: true, initial: e })}
												>
													<div className="px-1 py-0.5">
														<div className="text-[10px] font-medium truncate">{e.label}</div>
														<div className="text-[9px] opacity-90">
															{e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {e.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
					<AppointmentModal open={modal.open} onClose={() => setModal({ open: false, initial: null })} onSave={(data) => {
						setEvents((prev) => prev.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
						setModal({ open: false, initial: null });
					}} initial={modal.initial} rooms={rooms} />
				</div>
			</div>
		</div>
	);
}


