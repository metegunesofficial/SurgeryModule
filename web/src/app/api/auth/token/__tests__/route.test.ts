import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@auth/core/jwt', async () => {
  return {
    getToken: vi.fn(async () => null),
  };
});

describe('auth/token route', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AUTH_URL;
    process.env.AUTH_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('does not throw when AUTH_URL is undefined and returns 401 JSON', async () => {
    const { GET } = await import('../route.js');
    const res = await GET(new Request('http://localhost/api/auth/token'));
    expect(res.status).toBe(401);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });
});


