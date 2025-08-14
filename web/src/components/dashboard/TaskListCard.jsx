import { useEffect, useMemo, useState } from 'react';

const mockUsers = [
  { id: 'u1', name: 'Dr. Atilla' },
  { id: 'u2', name: 'Aslı Ataseven' },
  { id: 'u3', name: 'Mehmet Işlek' },
];

export default function TaskListCard({ fixedHeight = 360 }) {
  const STORAGE_KEY_TASKS = 'dashboard_tasks';
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Bugünkü ameliyat setlerini doğrula', completed: false, urgency: 'Yüksek', assignedTo: 'u2', dueDate: new Date() },
    { id: 't2', title: 'Sterilizasyon döngüsü raporlarını kontrol et', completed: true, urgency: 'Orta', assignedTo: 'u1', dueDate: new Date(Date.now() + 24*60*60000) },
    { id: 't3', title: 'OR-2 ekipman bakım kaydı oluştur', completed: false, urgency: 'Düşük', assignedTo: 'u3', dueDate: new Date(Date.now() + 48*60*60000) },
  ]);

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
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex flex-col" style={{ height: `clamp(320px, 65vh, ${fixedHeight}px)` }}>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        <a href="/gorevler" className="text-blue-600 hover:underline cursor-pointer">Görevler</a>
      </h2>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="grid grid-cols-12 gap-2 flex-1 min-w-0 w-full sm:mr-2">
          <input className="col-span-12 lg:col-span-4 border rounded px-2 py-1 text-sm" placeholder="Tümü" value={filters.text} onChange={(e) => setFilters((f) => ({ ...f, text: e.target.value }))} />
          <select className="col-span-6 lg:col-span-3 border rounded px-2 py-1 text-sm" value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
            <option value="">Öncelik (Tümü)</option>
            <option>Düşük</option>
            <option>Orta</option>
            <option>Yüksek</option>
            <option>Kritik</option>
          </select>
          <select className="col-span-6 lg:col-span-3 border rounded px-2 py-1 text-sm" value={filters.assignedTo} onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}>
            <option value="">Kişi (Tümü)</option>
            {mockUsers.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
          <input type="date" className="col-span-6 lg:col-span-1 border rounded px-2 py-1 text-sm" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} />
          <input type="date" className="col-span-6 lg:col-span-1 border rounded px-2 py-1 text-sm" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} />
        </div>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => {
          const nid = `t${Date.now()}`;
          setDraft({ title: '', urgency: 'Orta', assignedTo: mockUsers[0].id });
          setEditingId(nid);
          setTasks((prev) => [{ id: nid, title: '', completed: false, urgency: 'Orta', assignedTo: mockUsers[0].id, dueDate: new Date() }, ...prev]);
        }}>Yeni Görev</button>
      </div>
      <ul className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
        {filteredTasks.map((task) => {
          const isEditing = editingId === task.id;
          return (
            <li key={task.id} className="flex items-start gap-3">
              <input id={task.id} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={task.completed} onChange={() => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))} />
              <div className="flex-1">
                {isEditing ? (
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12">
                      <input autoFocus className="w-full border rounded px-2 py-1 text-sm" placeholder="Görev açıklaması" defaultValue={task.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                    </div>
                    <div className="col-span-6">
                      <label className="block text-[11px] text-gray-500 mb-1">Aciliyet</label>
                      <select className="w-full border rounded px-2 py-1 text-sm" defaultValue={task.urgency} onChange={(e) => setDraft((d) => ({ ...d, urgency: e.target.value }))}>
                        <option>Düşük</option>
                        <option>Orta</option>
                        <option>Yüksek</option>
                        <option>Kritik</option>
                      </select>
                    </div>
                    <div className="col-span-6">
                      <label className="block text-[11px] text-gray-500 mb-1">Atanan</label>
                      <select className="w-full border rounded px-2 py-1 text-sm" defaultValue={task.assignedTo} onChange={(e) => setDraft((d) => ({ ...d, assignedTo: e.target.value }))}>
                        {mockUsers.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
                      </select>
                    </div>
                    <div className="col-span-12 flex gap-2 justify-end">
                      <button className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200" onClick={() => { if (task.title === '' && draft.title === '') { setTasks((prev) => prev.filter((t) => t.id !== task.id)); } setEditingId(null); }}>İptal</button>
                      <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => { setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...draft, title: draft.title || t.title } : t))); setEditingId(null); }}>Kaydet</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <label htmlFor={task.id} className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title || 'Yeni görev'}</label>
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

function UserBadge({ userId }) {
  const u = mockUsers.find((x) => x.id === userId);
  return <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs">{u?.name || 'Atanmadı'}</span>;
}

function UrgencyChip({ level }) {
  const color = level === 'Kritik' ? 'bg-red-100 text-red-700 border-red-300' : level === 'Yüksek' ? 'bg-orange-100 text-orange-700 border-orange-300' : level === 'Orta' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-300';
  return <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${color}`}>{level}</span>;
}


