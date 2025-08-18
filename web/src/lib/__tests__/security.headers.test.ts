import { describe, it, expect } from 'vitest';
import { securityHeaders } from '../security';

function createMockContext() {
  const headers: Record<string, string> = {};
  return {
    header: (key: string, value: string) => {
      headers[key] = value;
    },
    get headers() {
      return headers;
    },
  } as any;
}

describe('securityHeaders middleware', () => {
  it('sets core security headers', async () => {
    const c = createMockContext();
    const next = vi.fn();
    await securityHeaders()(c, next);
    expect(c.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(c.headers['X-Frame-Options']).toBe('DENY');
    expect(c.headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(c.headers['Permissions-Policy']).toContain('geolocation=()');
    expect(c.headers['Permissions-Policy']).toContain('microphone=()');
    expect(c.headers['Permissions-Policy']).toContain('camera=()');
    expect(c.headers['Content-Security-Policy']).toContain("default-src 'self'");
  });
});


