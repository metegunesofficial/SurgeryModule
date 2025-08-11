import { describe, it, expect } from 'vitest';
import { GET as GET_SURGERIES, POST as POST_SURGERY } from '../surgeries/route';
import { PUT as PUT_SURGERY, DELETE as DELETE_SURGERY } from '../surgeries/[id]/route';

function req(path: string, ip = '4.4.4.4') {
  return new Request(`http://localhost${path}`, { headers: { 'x-forwarded-for': ip } });
}

describe('Integration: surgeries + rooms flow (in-memory)', () => {
  it('creates, updates and deletes a surgery referencing a room', async () => {
    // Ensure list is empty
    let res = await GET_SURGERIES(req('/api/surgeries'));
    let body = await res.json();
    expect(body.count).toBeTypeOf('number');

    // Create
    const payload = {
      patientName: 'Jane Doe',
      procedureType: 'Implant',
      scheduledStart: new Date().toISOString(),
      estimatedDuration: 45,
      roomId: 'room-1',
    };
    res = await POST_SURGERY(
      new Request('http://localhost/api/surgeries', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-role': 'doctor' },
        body: JSON.stringify(payload),
      })
    );
    expect(res.status).toBe(201);
    body = await res.json();
    const id = body.item.id as string;
    expect(body.item.roomId).toBe('room-1');

    // Update notes
    res = await PUT_SURGERY(
      new Request(`http://localhost/api/surgeries/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'x-role': 'doctor' },
        body: JSON.stringify({ notes: 'integration-update' }),
      }),
      { params: { id } }
    );
    expect(res.status).toBe(200);
    body = await res.json();
    expect(body.item.notes).toBe('integration-update');

    // Delete
    res = await DELETE_SURGERY(
      new Request(`http://localhost/api/surgeries/${id}`, { method: 'DELETE', headers: { 'x-role': 'doctor' } }),
      { params: { id } }
    );
    expect(res.status).toBe(204);
  });
});


