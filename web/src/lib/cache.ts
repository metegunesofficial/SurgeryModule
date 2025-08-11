type CacheEntry<T> = { value: T; expiresAt: number };

const memoryCache: Map<string, CacheEntry<unknown>> = new Map();

async function getFromUpstash<T>(key: string): Promise<T | undefined> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({ url, token });
  const data = await redis.get<string>(key);
  if (data == null) return undefined;
  try {
    return JSON.parse(data) as T;
  } catch {
    return undefined;
  }
}

async function setToUpstash<T>(key: string, value: T, ttlMs: number): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({ url, token });
  const ex = Math.max(1, Math.ceil(ttlMs / 1000));
  await redis.set(key, JSON.stringify(value), { ex });
}

export async function getCached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();

  // Try memory first
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > now) return entry.value;

  // Try Upstash if configured
  const upstashHit = await getFromUpstash<T>(key);
  if (upstashHit !== undefined) {
    // Refresh memory from Upstash
    memoryCache.set(key, { value: upstashHit, expiresAt: now + ttlMs });
    return upstashHit;
  }

  // Miss → fetch and populate
  const value = await fetcher();
  memoryCache.set(key, { value, expiresAt: now + ttlMs });
  await setToUpstash(key, value, ttlMs).catch(() => {});
  return value;
}


