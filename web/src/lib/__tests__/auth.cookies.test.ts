import { describe, it, expect } from 'vitest';
import { getSessionCookieOptions } from '../auth';

describe('getSessionCookieOptions', () => {
  it('uses secure none in production regardless of protocol', () => {
    const opts = getSessionCookieOptions({ NODE_ENV: 'production', AUTH_URL: 'http://example.com/api/auth' });
    expect(opts.secure).toBe(true);
    expect(opts.sameSite).toBe('none');
    expect(opts.httpOnly).toBe(true);
    expect(opts.path).toBe('/');
  });

  it('uses secure none when AUTH_URL is https', () => {
    const opts = getSessionCookieOptions({ NODE_ENV: 'development', AUTH_URL: 'https://example.com/api/auth' });
    expect(opts.secure).toBe(true);
    expect(opts.sameSite).toBe('none');
  });

  it('uses lax and not secure in dev http environments', () => {
    const opts = getSessionCookieOptions({ NODE_ENV: 'development', AUTH_URL: 'http://localhost:4000/api/auth' });
    expect(opts.secure).toBe(false);
    expect(opts.sameSite).toBe('lax');
  });
});


