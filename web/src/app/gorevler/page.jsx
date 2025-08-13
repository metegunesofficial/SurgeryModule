import { useMemo, useState } from 'react';

const mockUsers = [
	{ id: 'u1', name: 'Dr. Atilla' },
	{ id: 'u2', name: 'Aslı Ataseven' },
	{ id: 'u3', name: 'Mehmet Işlek' },
];

export default function GorevlerPage() {
	const [tasks, setTasks] = useState([
		{ id: 't1', title: 'Bugünkü ameliyat setlerini doğrula', completed: false, urgency: 'Yüksek', assignedTo: 'u2', dueDate: new Date() },
		{ id: 't2', title: 'Sterilizasyon döngüsü raporlarını kontrol et', completed: true, urgency: 'Orta', assignedTo: 'u1', dueDate: new Date(Date.now() + 86400000) },
		{ id: 't3', title: 'OR-2 ekipman bakım kaydı oluştur', completed: false, urgency: 'Düşük', assignedTo: 'u3', dueDate: new Date(Date.now() + 2 * 86400000) },
	]);
	const [filters, setFilters] = useState({ text: '', priority: '', assignedTo: '', from: '', to: '' });

	const filtered = useMemo(() => {
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
		<div className="space-y-6">
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h1 className="text-base font-semibold text-gray-900 mb-4">Görevler</h1>
				<div className="mb-3 grid grid-cols-12 gap-2">
					<input className="col-span-12 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tümü" value={filters.text} onChange={(e) => setFilters((f) => ({ ...f, text: e.target.value }))} />
					<select className="col-span-6 lg:col-span-2 border rounded px-2 py-1 text-sm" value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
						<option value="">Öncelik (Tümü)</option>
						<option>Düşük</option>
						<option>Orta</option>
						<option>Yüksek</option>
						<option>Kritik</option>
					</select>
					<select className="col-span-6 lg:col-span-2 border rounded px-2 py-1 text-sm" value={filters.assignedTo} onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}>
						<option value="">Kişi (Tümü)</option>
						{mockUsers.map((u) => (
							<option key={u.id} value={u.id}>{u.name}</option>
						))}
					</select>
					<input type="date" className="col-span-6 lg:col-span-2 border rounded px-2 py-1 text-sm" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} />
					<input type="date" className="col-span-6 lg:col-span-2 border rounded px-2 py-1 text-sm" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} />
				</div>
				<ul className="divide-y max-h-[70vh] overflow-y-auto pr-1">
					{filtered.map((t) => (
						<li key={t.id} className="py-3 flex items-start justify-between gap-2">
							<div>
								<p className={`text-sm ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.title}</p>
								<div className="mt-1 text-xs text-gray-600 flex items-center gap-3">
									<span className="inline-flex items-center rounded border px-2 py-0.5">{t.urgency}</span>
									<span>{mockUsers.find((u) => u.id === t.assignedTo)?.name || 'Atanmadı'}</span>
									<span>{t.dueDate?.toLocaleDateString?.() || ''}</span>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button className="text-xs text-blue-600 hover:underline">Düzenle</button>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}


