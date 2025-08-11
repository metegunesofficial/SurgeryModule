import { describe, it, expect } from 'vitest';
import * as sks from './sks/route';
import * as jci from './jci/route';

function req(path: string, ip = '3.3.3.3') {
  return new Request(`http://localhost${path}`, { headers: { 'x-forwarded-for': ip } });
}

describe('Reports endpoints', () => {
  it('returns SKS report stub', async () => {
    const res = await sks.GET(req('/api/reports/sks'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.report).toBe('sks');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('returns JCI report stub', async () => {
    const res = await jci.GET(req('/api/reports/jci'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.report).toBe('jci');
  });
});


