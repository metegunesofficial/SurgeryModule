-- Auth schema for Neon/Postgres
-- Safe to run multiple times

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS auth_users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name text,
	email text UNIQUE NOT NULL,
	"emailVerified" timestamptz,
	image text
);

CREATE TABLE IF NOT EXISTS auth_accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
	provider text NOT NULL,
	type text NOT NULL,
	"providerAccountId" text NOT NULL,
	access_token text,
	expires_at integer,
	refresh_token text,
	id_token text,
	scope text,
	session_state text,
	token_type text,
	password text
);

CREATE UNIQUE INDEX IF NOT EXISTS auth_accounts_provider_unique
	ON auth_accounts (provider, "providerAccountId");

CREATE INDEX IF NOT EXISTS auth_accounts_user_idx
	ON auth_accounts ("userId");

CREATE TABLE IF NOT EXISTS auth_sessions (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
	"sessionToken" text UNIQUE NOT NULL,
	expires timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS auth_sessions_user_idx
	ON auth_sessions ("userId");

CREATE TABLE IF NOT EXISTS auth_verification_token (
	identifier text NOT NULL,
	token text PRIMARY KEY,
	expires timestamptz NOT NULL
);


