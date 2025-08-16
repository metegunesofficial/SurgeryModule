import { createRateLimitedRoute } from '@/app/api/utils/rateLimit.js';

async function handler() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET = createRateLimitedRoute(handler, { windowMs: 1000, max: 5 });


