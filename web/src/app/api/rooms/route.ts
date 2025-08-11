import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { errorJson, json } from '../_lib/http';
import { getCached } from '@/lib/cache';
import { roomsResponseSchema } from '../_lib/schemas';

const limiter = createRateLimiter({ windowMs: 60_000, max: 60 });

export async function GET(request: Request) {
  const { allowed, remaining, resetIn } = await limiter(request);
  if (!allowed) return errorJson(429, 'Too many requests', undefined, {
    headers: buildRateLimitHeaders({ limit: 60, remaining, resetInMs: resetIn, includeRetryAfter: true }),
  });
  // Placeholder static rooms with cache
  const data = await getCached('rooms:list', 30_000, async () => ({
    items: [
      { id: 'room-1', name: 'Ameliyathane 1' },
      { id: 'room-2', name: 'Ameliyathane 2' },
      { id: 'room-3', name: 'Minör İşlem Odası' },
    ],
  }));
  const parsed = roomsResponseSchema.safeParse(data);
  if (!parsed.success) return errorJson(500, 'Invalid rooms payload');
  return json(
    parsed.data,
    { headers: buildRateLimitHeaders({ limit: 60, remaining, resetInMs: resetIn }) }
  );
}


