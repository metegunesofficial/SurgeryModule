import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { surgeryCreateSchema } from '../../_lib/schemas';
import { updateSurgery, removeSurgery } from '../../_lib/store.adapter';
import { requireRole } from '../../_lib/auth';
import { auditLog } from '../../_lib/audit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 60 });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
  const parsed = surgeryCreateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten() }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const { id } = await params;
  const updated = await updateSurgery(id, parsed.data);
  if (!updated) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  auditLog({ action: 'update', resource: 'surgery', resourceId: id });
  return Response.json({ item: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
  const { id } = await params;
  const ok = await removeSurgery(id);
  if (!ok) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  auditLog({ action: 'delete', resource: 'surgery', resourceId: id });
  return new Response(null, { status: 204 });
}


