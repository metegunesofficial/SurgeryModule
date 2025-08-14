import { useMemo, useState } from 'react';
import TaskListCard from '@/components/dashboard/TaskListCard.jsx';

const mockUsers = [
	{ id: 'u1', name: 'Dr. Atilla' },
	{ id: 'u2', name: 'Aslı Ataseven' },
	{ id: 'u3', name: 'Mehmet Işlek' },
];

export default function GorevlerPage() {
	// Boş veri ile başlat (ekran görüntüsü ile uyumlu)
	const [tasks] = useState([]);
	const [tab, setTab] = useState('active');
	const [advancedOpen, setAdvancedOpen] = useState(false);
	const [filters, setFilters] = useState({
		q: '',
		createdFrom: '',
		createdTo: '',
		endFrom: '',
		endTo: '',
		patient: '',
		person: '',
		onlyActiveStaff: false,
		sort: 'updatedAt',
	});

	const filtered = useMemo(() => {
		// Şimdilik yalnızca boş data için basit döndürme; ileri filtre mantığı gerektiğinde eklenebilir
		return tasks;
	}, [tasks, filters, tab]);

	return (
		<div className="space-y-4">
			<div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
				<div className="flex items-center justify-between mb-3">
					<h1 className="text-base font-semibold text-gray-900">Görevler</h1>
				</div>
				<TaskListCard fixedHeight={420} />
			</div>
		</div>
	);
}


