import { describe, it, expect } from 'vitest';
import { GET, POST } from './route';

function makeReq(ip = '2.2.2.2') {
  return new Request('http://localhost/api/surgeries', {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('GET /api/surgeries', () => {
  it('returns empty list initially', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ items: [], count: 0 });
  });

  it('applies rate limit', async () => {
    // Exceed default limit quickly
    let last: Response | null = null;
    for (let i = 0; i < 65; i++) {
      last = await GET(makeReq('9.9.9.9'));
    }
    expect(last!.status).toBe(429);
  });

  it('creates surgery with valid data', async () => {
    const payload = {
      patientName: 'Ali Veli',
      procedureType: 'Diş İmplantı',
      scheduledStart: new Date().toISOString(),
      estimatedDuration: 60,
    };
    const res = await POST(new Request('http://localhost/api/surgeries', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-role': 'doctor' },
      body: JSON.stringify(payload),
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.item).toHaveProperty('id');
    expect(body.item.patientName).toBe('Ali Veli');
  });
});


