import sql from '@/app/api/utils/sql.js';
import { createRateLimitedRoute } from '@/app/api/utils/rateLimit.js';
import { sendEmail } from '@/lib/notify/mock.ts';
import { randomBytes, createHash } from 'node:crypto';

async function handler(request) {
  let email = '';
  try {
    const body = await request.json();
    email = String(body?.email ?? '').trim().toLowerCase();
  } catch {}

  // Always respond with 200 to avoid email enumeration
  const genericResponse = new Response(
    JSON.stringify({ ok: true }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return genericResponse;
  }

  try {
    const userRows = await sql`select id, email from auth_users where email = ${email} limit 1`;
    if (!userRows?.[0]) {
      return genericResponse;
    }

    // Clean previous tokens for this identifier to reduce clutter
    await sql`delete from auth_verification_token where identifier = ${email}`;

    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await sql`insert into auth_verification_token (identifier, token, expires) values (${email}, ${hashedToken}, ${expires})`;

    const baseUrl = process.env.AUTH_URL || 'http://localhost:4000';
    const resetUrl = `${baseUrl}/account/reset/confirm?token=${rawToken}`;
    const text = `Parolanızı sıfırlamak için aşağıdaki bağlantıyı 15 dakika içinde kullanın:\n\n${resetUrl}\n\nEğer bu isteği siz yapmadıysanız, bu e-postayı yok sayabilirsiniz.`;
    if (process.env.NODE_ENV !== 'production') {
      // Helpful for local development when using mock email sender
      console.log('[password-reset] development reset link:', resetUrl);
    }
    await sendEmail(email, text);
  } catch {
    // Intentionally ignore to avoid leaking whether email exists
  }

  return genericResponse;
}

export const POST = createRateLimitedRoute(handler, { windowMs: 60_000, max: 5 });


