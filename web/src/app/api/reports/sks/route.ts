import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { json, errorJson } from '../../_lib/http';
import { reportResponseSchema } from '../../_lib/schemas';

const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });

export async function GET(request: Request) {
  const { allowed, remaining, resetIn } = await limiter(request);
  if (!allowed)
    return errorJson(429, 'Too many requests', undefined, {
      headers: buildRateLimitHeaders({ limit: 30, remaining, resetInMs: resetIn, includeRetryAfter: true }),
    });

  const payload = {
    report: 'sks',
    generatedAt: new Date().toISOString(),
    items: [
      { code: 'SAH01', title: 'Ameliyathane süreçleri', status: 'pending' },
      { code: 'SDS01', title: 'Sterilizasyon süreçleri', status: 'pending' },
    ],
  } as const;

  const parsed = reportResponseSchema.safeParse(payload);
  if (!parsed.success) return errorJson(500, 'Invalid report payload');

  return json(parsed.data, {
    headers: buildRateLimitHeaders({ limit: 30, remaining, resetInMs: resetIn }),
  });
}


