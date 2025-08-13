import { create } from 'zustand';
import type { SurgeryCase, BlockPlan, ResponsibilityMatrix, KitVerification } from '@/types/prd';

type PlanningState = {
	cases: SurgeryCase[];
	addCase: (c: SurgeryCase) => void;
	checkConflicts: () => { count: number; details: Array<{ a: SurgeryCase; b: SurgeryCase }> };
	// Block planning skeleton
	blocks: BlockPlan[];
	addBlock: (b: BlockPlan) => void;
	// Responsibility matrix skeleton
	responsibility?: ResponsibilityMatrix;
	setResponsibility: (r: ResponsibilityMatrix) => void;
	// Kit verification skeleton
	verifyKits: (input: { scanned_kit_ids: string[] }) => KitVerification;
};

export const useSurgeryPlanningStore = create<PlanningState>((set, get) => ({
	cases: [],
	addCase: (c) => set((s) => ({ cases: [...s.cases, c] })),
	checkConflicts: () => {
		const cases = get().cases;
		const conflicts: Array<{ a: SurgeryCase; b: SurgeryCase }> = [];
		for (let i = 0; i < cases.length; i++) {
			for (let j = i + 1; j < cases.length; j++) {
				const a = cases[i];
				const b = cases[j];
				const aStart = new Date(a.scheduled_start).getTime();
				const aEnd = aStart + a.estimated_duration_min * 60_000;
				const bStart = new Date(b.scheduled_start).getTime();
				const bEnd = bStart + b.estimated_duration_min * 60_000;
				const overlaps = a.room_id === b.room_id && aStart < bEnd && bStart < aEnd;
				if (overlaps) conflicts.push({ a, b });
			}
		}
		return { count: conflicts.length, details: conflicts };
	},
	// Block plan skeleton implementation
	blocks: [],
	addBlock: (b) => set((s) => ({ blocks: [...s.blocks, b] })),
	// Responsibility matrix
	responsibility: undefined,
	setResponsibility: (r) => set(() => ({ responsibility: r })),
	// Kit verification skeleton rule: mark valid when ids non-empty and unique
	verifyKits: ({ scanned_kit_ids }) => {
		const unique = new Set(scanned_kit_ids);
		return {
			scanned_kit_ids,
			all_kits_valid: scanned_kit_ids.length > 0 && unique.size === scanned_kit_ids.length,
		};
	},
}));


