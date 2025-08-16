import { describe, it, expect, beforeEach } from 'vitest';

describe('health rate limit', () => {
  beforeEach(async () => {
    const { __resetAllRateLimitersForTests } = await import('../../utils/rateLimit.js');
    __resetAllRateLimitersForTests();
  });

  it('allows up to max requests in window and then 429', async () => {
    const { GET } = await import('../route.js');
    let lastStatus = 200;
    for (let i = 0; i < 5; i++) {
      const res = await GET(new Request('http://localhost/api/health'));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(200);
    const blocked = await GET(new Request('http://localhost/api/health'));
    expect(blocked.status).toBe(429);
  });
});


