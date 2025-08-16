## Backend DB Setup and Migration Notes

### Prerequisites
- Ensure a PostgreSQL instance is reachable and set `DATABASE_URL` in the environment where commands are executed.
  - Example (production):
    - PowerShell: `$env:DATABASE_URL = "postgres://USER:PASSWORD@HOST:PORT/DBNAME"`
    - Bash: `export DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DBNAME"`
- From the `web` directory, use Node.js 20+.

### Commands (Production-safe, idempotent)
Run from `web/` directory:

1) Apply Auth schema
```
npm run db:apply-auth
```

2) Apply application migrations
```
npm run db:migrate
```

3) (Optional) Seed demo data
```
npm run db:seed
```

Notes:
- `db:apply-auth` executes `scripts/apply-auth-schema.mjs`, which runs `db/auth_schema.sql` split by statements.
- `db:migrate` executes `scripts/migrate.mjs`. It ensures `_migrations` table exists and records applied files to prevent re-running the same migration.
- SSL handling: For non-Neon Postgres URLs, SSL is enabled with `rejectUnauthorized: false` inside the scripts. Neon URLs use `@neondatabase/serverless` pool.

### Migrations Directory and Contents
Files in `web/db/migrations/` applied in lexicographic order and tracked in `_migrations(id, applied_at)`:

- `0001_init_auth.sql`
  - Creates core auth tables: `auth_users`, `auth_accounts`, `auth_sessions`, `auth_verification_token`.
  - Adds indexes and uniqueness constraints.

- `0002_core_schema.sql`
  - Core domain schema:
    - `hospitals` (name, address/city/country, totals, settings, timestamps, activity flag)
    - `departments` (by hospital)
    - `users` (domain users; references hospital/department, role, activity flags)
    - `operating_rooms` (unique per hospital and room number)
    - `surgeries` (basic scheduling with indexes on hospital/or/time)

- `0003_hospital_slug_env.sql`
  - Multi-tenant fields on `hospitals`:
    - Adds `slug` and `is_demo` columns
    - Adds partial unique index `hospitals_slug_uq` on `slug` when not null

### Operational Guidance
- Always set `DATABASE_URL` before running scripts (CI/Prod).
- Scripts are idempotent by design; re-running is safe and no-ops if already applied.
- Rollbacks are not implemented. Use standard database backup/restore mechanisms for recovery.

### Auth Cookie Security (Runtime)
- Configured in `web/src/lib/auth.ts`:
  - `authjs.session-token` is `httpOnly: true`, `path: '/'`.
  - `secure: true` and `sameSite: 'none'` when `AUTH_URL` starts with `https`.
  - Otherwise, `sameSite: 'lax'` and `secure: false` for local/dev.


