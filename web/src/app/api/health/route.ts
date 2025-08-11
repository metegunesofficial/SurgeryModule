import { getHealthStatus } from '../_lib/health';
import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { errorJson, json } from '../_lib/http';
import { healthResponseSchema } from '../_lib/schemas';

const limiter = createRateLimiter({ windowMs: 60_000, max: 60 });

export async function GET(request: Request) {
  const { allowed, remaining, resetIn } = await limiter(request);
  if (!allowed) return errorJson(429, 'Too many requests', undefined, {
    headers: buildRateLimitHeaders({ limit: 60, remaining, resetInMs: resetIn, includeRetryAfter: true }),
  });

  const services = await getHealthStatus();
  const payload = { status: 'healthy', timestamp: new Date().toISOString(), services } as const;
  const parsed = healthResponseSchema.safeParse(payload);
  if (!parsed.success) return errorJson(500, 'Invalid health payload');
  return json(parsed.data, { headers: buildRateLimitHeaders({ limit: 60, remaining, resetInMs: resetIn }) });
}


