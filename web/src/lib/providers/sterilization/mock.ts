export async function postOpSendToSterilization(admissionId: string): Promise<void> {
	// Mock integration: in real system, emit events to sterilization tracking
	// e.g., mark sets as 'used' and 'sent_to_sterilization'. Here we just resolve.
	return;
}


