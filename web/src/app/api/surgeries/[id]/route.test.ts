import { describe, it, expect } from 'vitest';
import { POST } from '../route';
import { PUT, DELETE } from './route';

async function createOne() {
  const payload = {
    patientName: 'Test',
    procedureType: 'İşlem',
    scheduledStart: new Date().toISOString(),
    estimatedDuration: 30,
  };
  const res = await POST(new Request('http://localhost/api/surgeries', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-role': 'doctor' }, body: JSON.stringify(payload)
  }));
  const body = await res.json();
  return body.item.id as string;
}

describe('PUT/DELETE /api/surgeries/:id', () => {
  it('updates existing surgery', async () => {
    const id = await createOne();
    const res = await PUT(new Request(`http://localhost/api/surgeries/${id}`, {
      method: 'PUT', headers: { 'content-type': 'application/json', 'x-role': 'doctor' }, body: JSON.stringify({ notes: 'updated' })
    }), { params: { id } });
    const body = await res.json();
    expect(body.item.notes).toBe('updated');
  });

  it('deletes existing surgery', async () => {
    const id = await createOne();
    const res = await DELETE(new Request(`http://localhost/api/surgeries/${id}`, { method: 'DELETE', headers: { 'x-role': 'doctor' } }), { params: { id } });
    expect(res.status).toBe(204);
  });
});


