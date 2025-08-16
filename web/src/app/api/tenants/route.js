import sql from '@/app/api/utils/sql.js';
import { createRateLimitedRoute } from '@/app/api/utils/rateLimit.js';

async function getHandler(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  try {
    if (slug) {
      const rows = await sql`select id, name, slug, is_demo from hospitals where slug = ${slug} limit 1`;
      return new Response(JSON.stringify(rows?.[0] ?? null), { headers: { 'Content-Type': 'application/json' } });
    }
    if (id) {
      const rows = await sql`select id, name, slug, is_demo from hospitals where id = ${id} limit 1`;
      return new Response(JSON.stringify(rows?.[0] ?? null), { headers: { 'Content-Type': 'application/json' } });
    }
    const rows = await sql`select id, name, slug, is_demo from hospitals order by name asc`;
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'TENANTS_FETCH_ERROR' }), { status: 500 });
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();
    const { name, slug, is_demo = false } = body ?? {};
    if (!name || !slug) {
      return new Response(JSON.stringify({ error: 'VALIDATION_ERROR' }), { status: 400 });
    }
    const rows = await sql`
      insert into hospitals (name, slug, is_demo, is_active)
      values (${name}, ${slug}, ${is_demo}, true)
      returning id, name, slug, is_demo
    `;
    return new Response(JSON.stringify(rows?.[0] ?? null), { headers: { 'Content-Type': 'application/json' } });
  } catch (_) {
    return new Response(JSON.stringify({ error: 'TENANT_CREATE_ERROR' }), { status: 500 });
  }
}

export const GET = createRateLimitedRoute(getHandler, { windowMs: 1000, max: 10 });
export const POST = createRateLimitedRoute(postHandler, { windowMs: 1000, max: 5 });


