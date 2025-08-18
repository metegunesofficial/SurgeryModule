import type { MiddlewareHandler } from 'hono';

export const securityHeaders = (): MiddlewareHandler => (c, next) => {
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Lock down powerful features by default; match vercel.json allowlist
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    // Basic CSP that allows inline styles for styled-jsx; adjust as needed
    c.header(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            // Allow inline/eval scripts due to dev tooling; production hardening via vercel.json applies at edge
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "connect-src 'self' https: ws:",
            "font-src 'self' data:",
            "frame-ancestors 'none'",
        ].join('; ')
    );
    return next();
};

export function createRateLimiter({ windowMs = 60_000, max = 100 } = {}): MiddlewareHandler {
    const hits = new Map<string, { count: number; resetAt: number }>();
    return async (c, next) => {
        const key = c.req.header('x-forwarded-for') ?? c.req.header('cf-connecting-ip') ?? c.req.header('x-real-ip') ?? c.req.raw.headers.get('x-vercel-ip') ?? c.req.raw.headers.get('fly-client-ip') ?? c.req.raw.headers.get('x-client-ip') ?? c.req.raw.headers.get('x-forwarded-for') ?? c.req.raw.headers.get('x-appengine-user-ip') ?? c.req.raw.headers.get('x-azure-socketip') ?? c.req.raw.headers.get('true-client-ip') ?? c.req.raw.headers.get('fastly-client-ip') ?? c.req.raw.headers.get('cf-connecting-ip') ?? c.req.raw.headers.get('x-cluster-client-ip') ?? c.req.raw.headers.get('x-forwarded') ?? c.req.raw.headers.get('forwarded') ?? c.req.raw.headers.get('x-forwarded-host') ?? c.req.raw.headers.get('x-forwarded-proto') ?? c.req.raw.headers.get('x-forwarded-server') ?? c.req.raw.headers.get('x-vercel-forwarded-for') ?? c.req.raw.headers.get('x-vercel-proxied-for') ?? c.req.raw.headers.get('x-vercel-proxied-forwarded-for') ?? c.req.raw.headers.get('x-vercel-ip-country') ?? 'anonymous';
        const now = Date.now();
        const existing = hits.get(key);
        if (!existing || now > existing.resetAt) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
        } else if (existing.count >= max) {
            return c.text('Too Many Requests', 429);
        } else {
            existing.count += 1;
            hits.set(key, existing);
        }
        return next();
    };
}


