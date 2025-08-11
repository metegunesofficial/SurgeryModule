import { surgeryStore } from '../../_lib/store';
import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { errorJson, json } from '../../_lib/http';
import { displayResponseSchema } from '../../_lib/schemas';

const limiter = createRateLimiter({ windowMs: 30_000, max: 120 });

export async function GET(request: Request) {
  const { allowed, remaining, resetIn } = await limiter(request);
  if (!allowed) return errorJson(429, 'Too many requests', undefined, {
    headers: buildRateLimitHeaders({ limit: 120, remaining, resetInMs: resetIn, includeRetryAfter: true }),
  });
  const { items } = surgeryStore.list();
  // Map to public display fields only
  const now = Date.now();
  const data = items.map((s) => ({
    id: s.id,
    roomId: s.roomId ?? null,
    patient: s.patientName,
    procedure: s.procedureType,
    status: s.status ?? 'scheduled',
    start: s.scheduledStart,
    remainingMinutes: s.estimatedDuration,
    updatedAt: new Date(now).toISOString(),
  }));
  const parsed = displayResponseSchema.safeParse({ items: data });
  if (!parsed.success) return errorJson(500, 'Invalid display payload');
  return json(parsed.data, {
    headers: buildRateLimitHeaders({ limit: 120, remaining, resetInMs: resetIn })
  });
}


