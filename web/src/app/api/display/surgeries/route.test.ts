import { describe, it, expect } from 'vitest';
import { GET } from './route';

function makeReq(ip = '7.7.7.7') {
  return new Request('http://localhost/api/display/surgeries', {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('GET /api/display/surgeries', () => {
  it('returns items array with public fields', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('applies rate limiting headers', async () => {
    const res = await GET(makeReq('8.8.8.8'));
    expect(res.headers.get('X-RateLimit-Limit')).toBeTruthy();
    expect(res.headers.get('X-RateLimit-Remaining')).toBeTruthy();
  });
});


