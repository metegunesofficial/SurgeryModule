export async function validateBedVacant(_bedId: string): Promise<boolean> {
	// Mock HBYS validation; always returns true in demo
	return true;
}

export async function reserveBed(_bedId: string): Promise<void> {
	// Mock reservation no-op
	return;
}

export async function releaseBed(_bedId: string): Promise<void> {
	// Mock release no-op
	return;
}


