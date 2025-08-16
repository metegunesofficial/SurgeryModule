export async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 250): Promise<T> {
	let attempt = 0;
	let lastErr: unknown;
	while (attempt <= retries) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (attempt === retries) break;
			await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
			attempt += 1;
		}
	}
	throw lastErr;
}


