import { describe, it, expect } from 'vitest';
import { createRateLimiter, buildRateLimitHeaders } from './rate-limit';

describe('rate-limit', () => {
  it('allows up to max requests within window', async () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 2 });
    const req = new Request('http://localhost/api/test', { headers: { 'x-forwarded-for': '1.1.1.1' } });
    const r1 = await limiter(req);
    const r2 = await limiter(req);
    const r3 = await limiter(req);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it('buildRateLimitHeaders produces standard headers', () => {
    const headers = buildRateLimitHeaders({ limit: 60, remaining: 10, resetInMs: 1500, includeRetryAfter: true });
    expect(headers['X-RateLimit-Limit']).toBe('60');
    expect(headers['X-RateLimit-Remaining']).toBe('10');
    expect(headers['X-RateLimit-Reset']).toBeTypeOf('string');
    expect(headers['Retry-After']).toBe('2'); // ceil(1.5s) => 2
  });
});


