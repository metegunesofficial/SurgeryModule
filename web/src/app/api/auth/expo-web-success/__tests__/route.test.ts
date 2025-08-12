import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const getTokenMock = vi.fn();
vi.mock('@auth/core/jwt', async () => {
  return {
    getToken: (...args: unknown[]) => getTokenMock(...args),
  };
});

describe('auth/expo-web-success route', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AUTH_URL;
    process.env.AUTH_SECRET = 'test-secret';
    getTokenMock.mockResolvedValueOnce('jwt-token').mockResolvedValueOnce({ sub: '1', email: 'a@b.c' });
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    getTokenMock.mockReset();
  });

  it('does not throw when AUTH_URL is undefined and returns html', async () => {
    const { GET } = await import('../route.js');
    const res = await GET(new Request('http://localhost/api/auth/expo-web-success'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/html');
  });
});


