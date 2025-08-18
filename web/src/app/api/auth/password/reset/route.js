import sql from '@/app/api/utils/sql.js';
import { createRateLimitedRoute } from '@/app/api/utils/rateLimit.js';
import { hash } from 'argon2';
import { createHash } from 'node:crypto';

async function handler(request) {
  try {
    const { token, password } = await request.json();
    if (typeof token !== 'string' || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: 'INVALID_REQUEST' }), { status: 400 });
    }
    if (password.length < 12) {
      return new Response(JSON.stringify({ error: 'WEAK_PASSWORD' }), { status: 400 });
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const rows = await sql`select identifier, expires from auth_verification_token where token = ${hashedToken} limit 1`;
    const row = rows?.[0];
    if (!row) {
      return new Response(JSON.stringify({ error: 'INVALID_TOKEN' }), { status: 400 });
    }
    if (new Date(row.expires).getTime() < Date.now()) {
      await sql`delete from auth_verification_token where token = ${hashedToken}`;
      return new Response(JSON.stringify({ error: 'TOKEN_EXPIRED' }), { status: 400 });
    }

    const email = row.identifier;
    const users = await sql`select id from auth_users where email = ${email} limit 1`;
    const user = users?.[0];
    if (!user) {
      // consume token anyway
      await sql`delete from auth_verification_token where token = ${hashedToken}`;
      return new Response(JSON.stringify({ error: 'USER_NOT_FOUND' }), { status: 404 });
    }

    const userId = user.id;
    const newPasswordHash = await hash(password);

    // Update credentials account password
    await sql`update auth_accounts set password = ${newPasswordHash} where "userId" = ${userId} and provider = 'credentials'`;
    // Remove used token
    await sql`delete from auth_verification_token where token = ${hashedToken}`;

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'RESET_FAILED' }), { status: 500 });
  }
}

export const POST = createRateLimitedRoute(handler, { windowMs: 60_000, max: 5 });


