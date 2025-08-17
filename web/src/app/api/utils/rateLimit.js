// Simple in-memory rate limiter for Next.js route handlers
// Not suitable for multi-instance prod without shared store; adequate for demo/tests

const hits = new Map();
let lastGlobalCleanupAt = 0;

function getClientKey(request) {
  const headers = request.headers || request?.raw?.headers || new Headers();
  const get = (k) => headers.get?.(k) || null;
  return (
    get('x-forwarded-for') ||
    get('cf-connecting-ip') ||
    get('x-real-ip') ||
    get('x-vercel-ip') ||
    get('fly-client-ip') ||
    get('x-client-ip') ||
    'anonymous'
  );
}

export function createRateLimitedRoute(handler, { windowMs = 60_000, max = 100 } = {}) {
  return async function rateLimitedHandler(request, ...rest) {
    const key = getClientKey(request);
    const now = Date.now();
    // Opportunistic cleanup to bound memory without altering behavior
    // Only runs occasionally and only removes entries whose window already expired
    if (hits.size > 1024 && now - lastGlobalCleanupAt > windowMs) {
      let scanned = 0;
      for (const [clientKey, meta] of hits) {
        if (meta.resetAt <= now) hits.delete(clientKey);
        scanned += 1;
        if (scanned >= 1024) break; // cap work per request
      }
      lastGlobalCleanupAt = now;
    }
    const existing = hits.get(key);
    if (!existing || now > existing.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
    } else if (existing.count >= max) {
      return new Response('Too Many Requests', { status: 429 });
    } else {
      existing.count += 1;
      hits.set(key, existing);
    }
    return handler(request, ...rest);
  };
}

// test-only helper
export function __resetAllRateLimitersForTests() {
  hits.clear();
}


