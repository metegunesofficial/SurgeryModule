type RateLimitKeyFunc = (req: Request) => string | Promise<string>;

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: RateLimitKeyFunc;
}

class MemoryBucket {
  private hits: Map<string, { count: number; resetAt: number }> = new Map();

  increment(key: string, windowMs: number) {
    const now = Date.now();
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + windowMs });
      return { count: 1, resetIn: windowMs };
    }
    entry.count += 1;
    this.hits.set(key, entry);
    return { count: entry.count, resetIn: entry.resetAt - now };
  }
}

const memoryBucket = new MemoryBucket();

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, keyGenerator } = options;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const useUpstash = Boolean(upstashUrl && upstashToken);

  if (useUpstash) {
    type UpstashLimiter = {
      limit: (key: string) => Promise<{ success: boolean; remaining: number; reset?: number }>;
    };
    let limiterPromise: Promise<UpstashLimiter> | null = null;
    const getLimiter = async () => {
      if (!limiterPromise) {
        limiterPromise = (async () => {
          const { Ratelimit } = await import('@upstash/ratelimit');
          const { Redis } = await import('@upstash/redis');
          const redis = new Redis({ url: upstashUrl!, token: upstashToken! });
          const seconds = Math.max(1, Math.floor(windowMs / 1000));
          return new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(max, `${seconds} s`),
            analytics: false,
          });
        })();
      }
      return limiterPromise;
    };

    return async function rateLimit(req: Request): Promise<{ allowed: boolean; remaining: number; resetIn: number }>{
      const key = await (keyGenerator ? keyGenerator(req) : getDefaultKey(req));
      const limiter = await getLimiter();
      const result = await limiter.limit(key);
      const now = Math.floor(Date.now() / 1000);
      const resetIn = Math.max(0, (result.reset ?? now) - now) * 1000;
      return { allowed: result.success, remaining: result.remaining, resetIn };
    };
  }

  // Fallback: in-memory limiter (keeps previous behavior)
  return async function rateLimit(req: Request): Promise<{ allowed: boolean; remaining: number; resetIn: number }>{
    const key = await (keyGenerator ? keyGenerator(req) : getDefaultKey(req));
    const { count, resetIn } = memoryBucket.increment(key, windowMs);
    const remaining = Math.max(0, max - count);
    return { allowed: count <= max, remaining, resetIn };
  };
}

function getDefaultKey(req: Request): string {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const path = new URL(req.url).pathname;
  return `${ip}:${path}`;
}

export function buildRateLimitHeaders(params: {
  limit: number;
  remaining: number;
  resetInMs?: number;
  includeRetryAfter?: boolean;
}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(params.limit),
    'X-RateLimit-Remaining': String(params.remaining),
  };
  if (typeof params.resetInMs === 'number') {
    const seconds = Math.ceil(params.resetInMs / 1000);
    headers['X-RateLimit-Reset'] = String(seconds);
    if (params.includeRetryAfter) headers['Retry-After'] = String(seconds);
  }
  return headers;
}


