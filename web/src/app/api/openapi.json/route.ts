export async function GET() {
  const schema = {
    openapi: '3.0.0',
    info: {
      title: 'Surgery & Sterilization API',
      version: '0.1.0',
    },
    paths: {
      '/api/health': { get: { summary: 'Health', responses: { 200: { description: 'OK' } } } },
      '/api/rooms': { get: { summary: 'List rooms', responses: { 200: { description: 'OK' } } } },
      '/api/surgeries': {
        get: { summary: 'List surgeries', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create surgery', responses: { 201: { description: 'Created' } } },
      },
      '/api/surgeries/{id}': {
        put: { summary: 'Update surgery', responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete surgery', responses: { 204: { description: 'No Content' } } },
      },
      '/api/display/surgeries': { get: { summary: 'Public display payload', responses: { 200: { description: 'OK' } } } },
      '/api/display/live': { get: { summary: 'SSE live updates', responses: { 200: { description: 'OK' } } } },
      '/api/reports/sks': { get: { summary: 'SKS report stub', responses: { 200: { description: 'OK' } } } },
      '/api/reports/jci': { get: { summary: 'JCI report stub', responses: { 200: { description: 'OK' } } } },
    },
  };
  return new Response(JSON.stringify(schema, null, 2), { headers: { 'Content-Type': 'application/json' } });
}


