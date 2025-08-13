## Deploy

1) Install deps: `npm ci`
2) Type check: `npm run typecheck`
3) Tests: `npm test`
4) Build: `npm run build`
5) Start: `npm run start`

Required env:
- `DATABASE_URL` (for Neon/Postgres)
- `AUTH_SECRET` and `AUTH_URL` (if using auth routes)
- `CORS_ORIGINS` (comma-separated)
- Optional: `NEXT_PUBLIC_CREATE_BASE_URL`, `NEXT_PUBLIC_CREATE_HOST`, `NEXT_PUBLIC_PROJECT_GROUP_ID`

## Database

- Apply auth schema (idempotent): `npm run db:apply-auth`
- Run SQL migrations in `db/migrations`: `npm run db:migrate`

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
