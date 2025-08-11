import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { surgeryCreateSchema } from '../_lib/schemas';
import { listSurgeries, createSurgery } from '../_lib/store.adapter';
import { requireRole } from '../_lib/auth';
import { broadcastDisplayUpdate } from '../_lib/events';
import { auditLog } from '../_lib/audit';
import { surgeriesResponseSchema, surgeryItemSchema } from '../_lib/schemas';

const limiter = createRateLimiter({ windowMs: 60_000, max: 60 });

export async function GET(request: Request) {
  const { allowed, remaining, resetIn } = await limiter(request);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...buildRateLimitHeaders({ limit: 60, remaining, resetInMs: resetIn, includeRetryAfter: true }),
      },
    });
  }

  const data = await listSurgeries();
  const parsed = surgeriesResponseSchema.safeParse(data);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return Response.json(parsed.data);
}

// In-memory store is centralized in _lib/store

export async function POST(request: Request) {
  const { allowed, remaining, resetIn } = await limiter(request);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...buildRateLimitHeaders({ limit: 60, remaining, resetInMs: resetIn, includeRetryAfter: true }),
      },
    });
  }

  const forbidden = requireRole(request, ['admin','doctor']);
  if (forbidden) return forbidden;

  const body = await request.json().catch(() => ({}));
  const parsed = surgeryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten() }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const item = await createSurgery(parsed.data);
  const check = surgeryItemSchema.safeParse(item);
  if (!check.success) {
    return new Response(JSON.stringify({ error: 'Invalid created item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  broadcastDisplayUpdate({ type: 'display-update', payload: { action: 'created', id: item.id } });
  auditLog({ action: 'create', resource: 'surgery', resourceId: item.id });
  return new Response(JSON.stringify({ item }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}


