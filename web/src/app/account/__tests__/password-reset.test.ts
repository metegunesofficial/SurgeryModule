import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/notify/mock.ts', async () => {
  const mod = await vi.importActual<any>('@/lib/notify/mock.ts');
  return {
    ...mod,
    sendEmail: vi.fn(async () => ({ ok: true, queued: 1 })),
  };
});

vi.mock('@/app/api/utils/sql.js', () => {
  const mockSql = async () => [] as any[];
  // also expose transaction if called
  (mockSql as any).transaction = async (fn: any) => fn({ sql: mockSql });
  return { default: mockSql };
});

// Provide DATABASE_URL-less sql to throw if used accidentally without env
// In unit tests here we will not assert DB mutations, only route shapes.

describe('password reset flow', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('forgot always returns ok:true to avoid enumeration', async () => {
    const { POST } = await import('@/app/api/auth/password/forgot/route.js');
    const res = await POST(new Request('http://localhost/api/auth/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@example.com' }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  it('reset validates payload', async () => {
    const { POST } = await import('@/app/api/auth/password/reset/route.js');
    const bad1 = await POST(new Request('http://localhost/api/auth/password/reset', { method: 'POST', body: JSON.stringify({}) }));
    expect(bad1.status).toBe(400);
  });
});


