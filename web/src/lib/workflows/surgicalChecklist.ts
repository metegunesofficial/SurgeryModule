export type ChecklistState = {
	preop: boolean;
	timeout: boolean;
	postop: boolean;
};

export const initialChecklist: ChecklistState = {
	preop: false,
	timeout: false,
	postop: false,
};

export function completePreop(state: ChecklistState): ChecklistState {
	return { ...state, preop: true };
}

export function completeTimeout(state: ChecklistState): ChecklistState {
	if (!state.preop) return state; // enforce order
	return { ...state, timeout: true };
}

export function completePostop(state: ChecklistState): ChecklistState {
	if (!state.timeout) return state; // enforce order
	return { ...state, postop: true };
}

export function isChecklistComplete(state: ChecklistState): boolean {
	return !!(state.preop && state.timeout && state.postop);
}


