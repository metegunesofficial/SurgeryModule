import { useMemo, useState } from 'react';
import TaskListCard from '@/components/dashboard/TaskListCard.jsx';

const mockUsers = [
	{ id: 'u1', name: 'Dr. Atilla' },
	{ id: 'u2', name: 'Aslı Ataseven' },
	{ id: 'u3', name: 'Mehmet Işlek' },
];

export default function GorevlerPage() {
	// Note: TaskListCard already uses shared localStorage with dashboard
	// No additional state management needed - data is synchronized automatically

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="grid grid-cols-12 gap-6 md:gap-8 w-full max-w-7xl mx-auto p-6">
				{/* Header */}
				<div className="col-span-12">
					<div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
						<h1 className="text-2xl font-bold text-slate-900 mb-2">Görevler</h1>
						<p className="text-slate-600">Tüm görevleri yönetin ve takip edin</p>
					</div>
				</div>

				{/* Main Content */}
				<div className="col-span-12">
					<div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
						<TaskListCard fixedHeight={600} />
					</div>
				</div>
			</div>
		</div>
	);
}


