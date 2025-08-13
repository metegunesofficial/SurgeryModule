import { useMemo, useState, useRef } from 'react';

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
	const [form, setForm] = useState(() => {
		if (!initial) return null;
		return {
			title: initial.label || '',
			room_id: initial.room_id || (rooms?.[0] || ''),
			date: initial.start ? initial.start.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
			time: initial.start ? initial.start.toTimeString().slice(0, 5) : '09:00',
			duration: Math.max(30, Math.round(((initial.end - initial.start) / 60000) || 60)),
			type: initial.type || 'Cerrahi',
			status: initial.status || 'Planlandı',
			note: initial.note || '',
		};
	});
	if (!open || !form) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-[680px] bg-white rounded-lg border border-gray-200 shadow-xl">
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
						<input type="number" className="w-full border rounded px-2 py-1 text-sm" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value || 0) })} />
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
						onSave({ ...initial, label: form.title || 'Randevu', room_id: form.room_id, start, end, status: form.status, note: form.note });
					}}>Kaydet</button>
				</div>
			</div>
		</div>
	);
}

export default function RandevularPage() {
	const today = new Date();
	const startOfDay = setTime(today, 8, 0);
	const rooms = ['OR-1', 'OR-2', 'OR-3'];
	const [events, setEvents] = useState([
		{ id: 's1', room_id: 'OR-1', label: 'Diş çekimi (A01)', start: addMinutes(startOfDay, 15), end: addMinutes(startOfDay, 75), status: 'in_progress' },
		{ id: 's2', room_id: 'OR-2', label: 'İmplant (B12)', start: addMinutes(startOfDay, 90), end: addMinutes(startOfDay, 150), status: 'planned' },
		{ id: 's3', room_id: 'OR-3', label: 'Dolgu (C07)', start: addMinutes(startOfDay, 180), end: addMinutes(startOfDay, 240), status: 'planned' },
	]);
	const [modal, setModal] = useState({ open: false, initial: null });
	const scrollRef = useRef(null);
	const gridRef = useRef(null);
	const startHour = 8;
	const endHour = 20;
	const totalMinutes = (endHour - startHour) * 60;
	const hours = useMemo(() => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i), []);

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg border border-gray-200 p-6">
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
							<div className="col-span-1 select-none">
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
											const color = e.status === 'in_progress' ? 'bg-blue-500/80 border-blue-600' : e.status === 'completed' ? 'bg-emerald-500/80 border-emerald-600' : e.status === 'cancelled' ? 'bg-red-500/80 border-red-600' : 'bg-amber-500/80 border-amber-600';
											return (
												<div
													key={e.id}
													className={`absolute left-2 right-2 rounded-md border text-white shadow-sm ${color}`}
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


