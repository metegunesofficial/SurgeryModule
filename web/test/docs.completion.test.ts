import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function read(rootRelative: string): string {
  const p = resolve(__dirname, '..', '..', rootRelative);
  return readFileSync(p, 'utf8');
}

function readDocWithFallback(rootRelative: string): string {
  const p = resolve(__dirname, '..', '..', rootRelative);
  if (existsSync(p)) return readFileSync(p, 'utf8');
  return read('DOCS_COMBINED.md');
}

describe('Documentation completion verification', () => {
  it('DOCS includes DB setup commands (scripts or direct node commands; seed optional)', () => {
    const md = readDocWithFallback('README-updated.md');
    expect(md).toMatch(/(db:apply-auth|apply-auth-schema\.mjs)/);
    expect(md).toMatch(/(db:migrate|migrate\.mjs)/);
    // Seed may be omitted for prod; accept either presence or explicit omission
    // No hard assertion for seed here to avoid coupling to prod policy text
  });

  it('DOCS includes web setup commands (db:setup or equivalent steps; seed optional)', () => {
    const md = readDocWithFallback('web/README.md');
    // Accept scripts or the explicit steps present in combined docs
    const hasSetupScript = /db:setup/.test(md);
    const hasEquivalentSetup = /(apply-auth-schema\.mjs)/.test(md) && /migrate\.mjs/.test(md);
    expect(hasSetupScript || hasEquivalentSetup).toBe(true);
  });

  it('DOCS_COMBINED.md references critical sections 6(UI), 7(pages), 8, 13', () => {
    const md = read('DOCS_COMBINED.md');
    expect(md).toMatch(/##\s*6\)\s*Kimlik Doğrulama ve RBAC/i);
    expect(md).toMatch(/##\s*7\)\s*Çoklu/i);
    expect(md).toMatch(/##\s*8\)\s*Test ve Kalite/i);
    expect(md).toMatch(/##\s*13\)\s*Son Smoke ve Kabul/i);
  });

  it('migrations 0001, 0002, 0003 exist and contain expected anchors', () => {
    const m1 = read('web/db/migrations/0001_init_auth.sql');
    const m2 = read('web/db/migrations/0002_core_schema.sql');
    const m3 = read('web/db/migrations/0003_hospital_slug_env.sql');
    expect(m1).toMatch(/auth_users/);
    expect(m2).toMatch(/CREATE TABLE IF NOT EXISTS hospitals/i);
    expect(m2).toMatch(/CREATE TABLE IF NOT EXISTS users/i);
    expect(m2).toMatch(/CREATE TABLE IF NOT EXISTS operating_rooms/i);
    expect(m2).toMatch(/CREATE TABLE IF NOT EXISTS surgeries/i);
    expect(m3).toMatch(/slug/);
    expect(m3).toMatch(/is_demo/);
  });

  it('seed script includes demo clinic slug and is_demo flag', () => {
    const seed = read('web/scripts/seed.mjs');
    expect(seed).toMatch(/'demo'/);
    expect(seed).toMatch(/is_demo/);
  });
});


