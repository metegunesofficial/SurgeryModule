import { describe, it, expect } from 'vitest';

describe('health route', () => {
  it('returns 200 and ok:true', async () => {
    const { GET } = await import('../route.js');
    const res = await GET(new Request('http://localhost/api/health'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });
});


