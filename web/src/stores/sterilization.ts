import { create } from 'zustand';
import type { SterilizationKit, SterilizationCycle, ScanEvent, Indicator, Recall, Wash } from '@/types/prd';

type SterilizationState = {
	kits: SterilizationKit[];
	cycles: SterilizationCycle[];
	events: ScanEvent[];
	addKit: (k: SterilizationKit) => void;
	updateKitStatus: (kit_id: string, status: SterilizationKit['status']) => void;
	addCycle: (c: SterilizationCycle) => void;
	addEvent: (e: ScanEvent) => void;
	// Extended skeletons
	indicators: Array<Indicator & { kit_id?: string }>;
	setIndicator: (kit_id: string, indicator: Partial<Indicator>) => void;
	recalls: Recall[];
	initiateRecall: (r: Recall) => void;
	washes: Wash[];
	addWash: (w: Wash) => void;
	// Blocking rule helper (placeholder, no UI enforcement)
	canReleaseKit: (kit_id: string) => boolean;
};

export const useSterilizationStore = create<SterilizationState>((set, get) => ({
	kits: [],
	cycles: [],
	events: [],
	addKit: (k) => set((s) => ({ kits: [...s.kits, k] })),
	updateKitStatus: (kit_id, status) => set((s) => ({
		kits: s.kits.map((k) => (k.kit_id === kit_id ? { ...k, status } : k)),
	})),
	addCycle: (c) => set((s) => ({ cycles: [...s.cycles, c] })),
	addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
	// Extended
	indicators: [],
	setIndicator: (kit_id, indicator) => set((s) => {
		// Upsert indicator per kit_id
		const existingIndex = s.indicators.findIndex((ind) => ind.kit_id === kit_id);
		if (existingIndex >= 0) {
			const next = [...s.indicators];
			next[existingIndex] = { ...next[existingIndex], ...indicator, kit_id } as Indicator & { kit_id?: string };
			return { indicators: next };
		}
		return { indicators: [...s.indicators, { ...indicator, kit_id } as Indicator & { kit_id?: string }] };
	}),
	recalls: [],
	initiateRecall: (r) => set((s) => ({ recalls: [...s.recalls, r] })),
	washes: [],
	addWash: (w) => set((s) => ({ washes: [...s.washes, w] })),
	canReleaseKit: (kit_id) => {
		const state = get();
		const indicator = state.indicators.find((i) => i.kit_id === kit_id);
		if (indicator?.ci_result === 'fail') return false;
		const kit = state.kits.find((k) => k.kit_id === kit_id);
		if (!kit?.last_cycle_id) return true;
		const cycle = state.cycles.find((c) => c.cycle_id === kit.last_cycle_id);
		if (cycle?.BI_result === 'fail') return false;
		return true;
	},
}));


