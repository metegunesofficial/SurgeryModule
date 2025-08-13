import React, { memo } from 'react';
import spec from '../../../docs/ameliyathane-sterilizasyon-prd.tr.json';

function countAllSubmodules(modules) {
	return modules.reduce((acc, m) => acc + (m.submodules?.length || 0), 0);
}

function countAllFeatures(modules) {
	return modules.reduce((acc, m) => acc + (m.submodules?.reduce((a, s) => a + (s.features?.length || 0), 0) || 0), 0);
}

function countAllEquipment(modules) {
	return modules.reduce((acc, m) => acc + (m.submodules?.reduce((a, s) => a + (s.equipment?.length || 0), 0) || 0), 0);
}

function countRequirements(modules, key) {
	return modules.reduce((acc, m) => acc + (m.requirements?.[key]?.length || 0), 0);
}

function UyumPage() {
	const modules = spec.modules || [];
	const standards = spec.standards || [];
	const notes = spec.notes || '';

	const totals = {
		modules: modules.length,
		submodules: countAllSubmodules(modules),
		features: countAllFeatures(modules),
		equipment: countAllEquipment(modules),
		functional: countRequirements(modules, 'functional'),
		performance: countRequirements(modules, 'performance'),
		user: countRequirements(modules, 'user'),
		physical: countRequirements(modules, 'physical'),
		legal: countRequirements(modules, 'legal'),
		error_handling: countRequirements(modules, 'error_handling'),
		standards: standards.length,
	};

    return (
        <main aria-labelledby="page-title" className="p-4" role="main">
			<h1 id="page-title" className="text-2xl font-semibold mb-4">PRD Uyum Görünümü</h1>

			{/* Summary Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
				<div className="p-3 rounded border border-gray-200">
					<div className="text-gray-500 text-sm">Modül</div>
					<div data-testid="spec-total-modules" className="text-xl font-bold">{totals.modules}</div>
				</div>
				<div className="p-3 rounded border border-gray-200">
					<div className="text-gray-500 text-sm">Alt Modül</div>
					<div data-testid="spec-total-submodules" className="text-xl font-bold">{totals.submodules}</div>
				</div>
				<div className="p-3 rounded border border-gray-200">
					<div className="text-gray-500 text-sm">Özellik</div>
					<div data-testid="spec-total-features" className="text-xl font-bold">{totals.features}</div>
				</div>
				<div className="p-3 rounded border border-gray-200">
					<div className="text-gray-500 text-sm">Ekipman</div>
					<div data-testid="spec-total-equipment" className="text-xl font-bold">{totals.equipment}</div>
				</div>
			</div>

			{/* Modules Listing */}
			{modules.map((module, mIdx) => (
				<section key={mIdx} className="mb-10">
					<h2 className="text-xl font-semibold mb-2">{module.module_name}</h2>
					{module.description ? (
						<p className="text-sm text-gray-600 mb-4">{module.description}</p>
					) : null}

					{Array.isArray(module.submodules) && module.submodules.map((sm, sIdx) => (
						<div key={sIdx} className="mb-6">
							<h3 className="text-base font-semibold mb-2">{sm.submodule_name}</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div className="p-3 rounded border border-gray-200">
									<div className="text-sm font-medium mb-2">Özellikler</div>
									<ul className="list-disc pl-5 text-sm space-y-1">
										{(sm.features || []).map((f, i) => (
											<li key={i}>{f}</li>
										))}
									</ul>
								</div>
								<div className="p-3 rounded border border-gray-200">
									<div className="text-sm font-medium mb-2">Ekipman</div>
									<ul className="list-disc pl-5 text-sm space-y-1">
										{(sm.equipment || []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					))}

					{/* Requirements */}
					{module.requirements ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Object.entries(module.requirements).map(([key, items]) => (
								<div key={key} className="p-3 rounded border border-gray-200">
									<div className="text-sm font-semibold mb-2">
										{key === 'functional' && 'Fonksiyonel Gereksinimler'}
										{key === 'performance' && 'Performans Gereksinimleri'}
										{key === 'user' && 'Kullanıcı Gereksinimleri'}
										{key === 'physical' && 'Fiziksel Gereksinimler'}
										{key === 'legal' && 'Yasal Gereksinimler'}
										{key === 'error_handling' && 'Hata Yönetimi'}
									</div>
									<ul className="list-disc pl-5 text-sm space-y-1">
										{(items || []).map((it, i) => (
											<li key={i}>{it}</li>
										))}
									</ul>
								</div>
							))}
						</div>
					) : null}
				</section>
			))}

			{/* Requirements Totals */}
			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">Gereksinim Toplamları</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
					<div className="p-3 rounded border border-gray-200">
						<div className="text-gray-500 text-sm">Fonksiyonel</div>
						<div data-testid="spec-req-functional" className="text-xl font-bold">{totals.functional}</div>
					</div>
					<div className="p-3 rounded border border-gray-200">
						<div className="text-gray-500 text-sm">Performans</div>
						<div data-testid="spec-req-performance" className="text-xl font-bold">{totals.performance}</div>
					</div>
					<div className="p-3 rounded border border-gray-200">
						<div className="text-gray-500 text-sm">Kullanıcı</div>
						<div data-testid="spec-req-user" className="text-xl font-bold">{totals.user}</div>
					</div>
					<div className="p-3 rounded border border-gray-200">
						<div className="text-gray-500 text-sm">Fiziksel</div>
						<div data-testid="spec-req-physical" className="text-xl font-bold">{totals.physical}</div>
					</div>
					<div className="p-3 rounded border border-gray-200">
						<div className="text-gray-500 text-sm">Yasal</div>
						<div data-testid="spec-req-legal" className="text-xl font-bold">{totals.legal}</div>
					</div>
					<div className="p-3 rounded border border-gray-200">
						<div className="text-gray-500 text-sm">Hata Yönetimi</div>
						<div data-testid="spec-req-error_handling" className="text-xl font-bold">{totals.error_handling}</div>
					</div>
				</div>
			</section>

			{/* Standards */}
			<section className="mb-10">
				<h2 className="text-xl font-semibold mb-2">Standartlar</h2>
				<div className="p-3 rounded border border-gray-200">
					<div className="text-gray-500 text-sm mb-2">Toplam</div>
					<div data-testid="spec-standards-count" className="text-xl font-bold mb-3">{totals.standards}</div>
					<ul className="list-disc pl-5 text-sm space-y-1">
						{standards.map((std, i) => (
							<li key={i}>{std}</li>
						))}
					</ul>
				</div>
			</section>

			{/* Notes */}
			{notes ? (
				<section className="mb-10">
					<h2 className="text-xl font-semibold mb-2">Notlar</h2>
					<div data-testid="spec-notes" className="p-3 rounded border border-gray-200 text-sm text-gray-700">
						{notes}
					</div>
				</section>
			) : null}
		</main>
	);
}

export default memo(UyumPage);


