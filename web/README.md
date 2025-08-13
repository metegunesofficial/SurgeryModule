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

