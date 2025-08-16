## Deployment, Security Headers, Observability, Rollback, Release

### Build & Test Pipeline (local/CI)
- cd web
- npm ci
- npm run typecheck
- npm test
- npx playwright install chromium
- npm run e2e
- npm run build

### Vercel Project Setup
- Root `vercel.json` sets build root to `web` via custom commands. `web/vercel.json` is also present and includes security headers for static hosting contexts.
- Build Output: `web/build` (client + server). Functions runtime: Node.js 20.

### Security Headers (Vercel)
Configured in `vercel.json` and `web/vercel.json` for all routes:
- Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: ws:
- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- X-Content-Type-Options: nosniff
- Permissions-Policy: geolocation=(), microphone=(), camera=()

Prod validation (sample):
```
curl -sI https://<your-domain> | findstr /R "content-security-policy\|strict-transport-security\|x-frame-options\|referrer-policy\|x-content-type-options\|permissions-policy"
```

### Environment Variables
Required (see `web/src/lib/env.ts`):
- NODE_ENV: development | test | production
- DATABASE_URL: Postgres URL
- AUTH_SECRET: string
- AUTH_URL: optional URL
- CORS_ORIGINS: optional

Note: Build uses prerender; in prerender `PRERENDER=true` may be set internally and missing envs won’t crash non-prod builds.

### Logs, Monitoring, Alerts (Vercel)
- Real-time logs:
  - `vercel logs <deployment-url> --since=1h`
  - `vercel logs <project-name> --prod --since=1h`
- Log drains (recommended):
  - Set up a Log Drain to Datadog, New Relic, or Grafana Loki under Project Settings → Logs → Log Drains.
- Alerts:
  - Project Settings → Alerts. Add metrics (errors, cold starts, function duration). Configure Slack/Email/Webhook notifications.

### Rollback Plan
- Use “Previous Deployment” on Vercel:
  1) Go to Project → Deployments.
  2) Pick the last green deployment.
  3) Click Promote to Production (or set Alias) to instantly roll back.
- CLI alternative:
  - `vercel ls <project>` to identify previous URL
  - `vercel alias set <previous-deployment-url> <prod-alias>`

### Release Management
- SemVer bump: update version in `web/package.json` (manual by repo owner).
- CHANGELOG: append notes for features/fixes/chore.
- Tag: create Git tag matching the new version.

### Operational Notes
- Caching: Static assets get `Cache-Control: public, max-age=31536000, immutable`.
- Functions: `api/index.ts` on Node.js 20, 1024 MB, 60s timeout.
- Build root: `web` (root `vercel.json` uses custom commands `cd web && ...`).

### On-Call Quick Checks
- Health: `curl -sS https://<prod-domain>/api/health` (should be 200)
- Headers: use the curl snippet above.
- SSR: Confirm `build/server/index.js` exists in artifact and routes serve HTML.

