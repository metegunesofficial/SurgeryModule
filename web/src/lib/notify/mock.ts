type Message = { to: string; text: string };

const queue: Message[] = [];

export async function sendSMS(to: string, text: string): Promise<{ ok: true; queued: number }> {
	queue.push({ to, text });
	return { ok: true, queued: queue.length };
}

export async function sendEmail(to: string, text: string): Promise<{ ok: true; queued: number }> {
	queue.push({ to, text });
	return { ok: true, queued: queue.length };
}

export function getQueueLength() {
	return queue.length;
}


