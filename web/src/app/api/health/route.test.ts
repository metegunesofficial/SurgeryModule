import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns healthy status with required fields', async () => {
    const req = new Request('http://localhost/api/health');
    const res = await GET(req);
    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body).toHaveProperty('timestamp');
    expect(body.services).toHaveProperty('database');
  });
});


