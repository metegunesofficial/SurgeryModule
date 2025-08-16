## Deploy

1) Install deps: `npm ci`
2) Type check: `npm run typecheck`
3) Tests: `npm test`
4) Build: `npm run build`
5) Start: `npm run start`

### Vercel Deployment (Node serverless)

- Add the repo to Vercel (project root). Root `vercel.json` routes build to `web` folder.
- Required env (Project Settings → Environment Variables):
  - `DATABASE_URL` (Supabase Postgres URI)
  - `AUTH_SECRET` (random 32+ chars)
  - `AUTH_URL` (e.g. `https://<your-app>.vercel.app/api/auth`)
  - `CORS_ORIGINS` (optional)
- After first deploy, open Vercel Deployment Terminal and run:
  - `node scripts/apply-auth-schema.mjs`
  - `node scripts/migrate.mjs`

### Supabase Setup

1) Create Supabase project
2) Copy Database → Connection Info → URI as `DATABASE_URL`
3) Apply auth schema and migrations locally or on Vercel as above

Required env:
- `DATABASE_URL` (for Neon/Postgres)
- `AUTH_SECRET` and `AUTH_URL` (if using auth routes)
- `CORS_ORIGINS` (comma-separated)
- Optional: `NEXT_PUBLIC_CREATE_BASE_URL`, `NEXT_PUBLIC_CREATE_HOST`, `NEXT_PUBLIC_PROJECT_GROUP_ID`

## Database

- Apply auth schema (idempotent): `npm run db:apply-auth`
- Run SQL migrations in `db/migrations`: `npm run db:migrate`
- Seed development data (optional): `npm run db:seed`
 - One-shot setup (auth + migrate + seed): `npm run db:setup`

## Local Development

1) Create `.env` and set: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `CORS_ORIGINS`
3) Dev server: `npm run dev`

## PRD Uyum Görünümü

`/uyum` rotası, `docs/ameliyathane-sterilizasyon-prd.tr.json` dosyasındaki tüm modül, alt modül, özellik, ekipman ve gereksinimleri (fonksiyonel, performans, kullanıcı, fiziksel, yasal, hata yönetimi) ile standartları dinamik olarak listeler ve özetler. Testler `src/app/uyum/__tests__/page.test.tsx` altındadır.


## Ortam Değişkenleri (.env)

Aşağıdaki örneği proje kökünde `web/.env` olarak oluşturun:

```
NODE_ENV=development
PORT=4000

# Postgres bağlantı dizesi (Neon/Supabase destekli)
DATABASE_URL=

# Auth
AUTH_SECRET=
# Örn: http://localhost:4000/api/auth (dev için opsiyonel)
AUTH_URL=

# CORS (virgülle ayrılmış)
# Örn: http://localhost:4000,https://your-domain.com
CORS_ORIGINS=

# Opsiyonel CREATE.xyz entegrasyonu (kullanılmıyorsa boş bırakın)
NEXT_PUBLIC_CREATE_BASE_URL=https://www.create.xyz
NEXT_PUBLIC_CREATE_HOST=localhost:4000
NEXT_PUBLIC_PROJECT_GROUP_ID=dev
```
