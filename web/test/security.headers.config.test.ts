import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

function loadVercelJson(filePath: string) {
  const contents = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(contents) as { headers?: HeaderRule[] };
}

function findRootRule(rules: HeaderRule[] | undefined): HeaderRule | undefined {
  return rules?.find((r) => r.source === '/(.*)');
}

function headerValue(rule: HeaderRule | undefined, key: string): string | undefined {
  const h = rule?.headers.find((h) => h.key.toLowerCase() === key.toLowerCase());
  return h?.value;
}

describe('Vercel headers configuration', () => {
  it('root vercel.json includes required security headers', () => {
    const vercelPath = path.resolve(__dirname, '..', '..', 'vercel.json');
    const config = loadVercelJson(vercelPath);
    const root = findRootRule(config.headers);
    expect(root).toBeTruthy();
    expect(headerValue(root, 'X-Frame-Options')).toBe('DENY');
    expect(headerValue(root, 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(headerValue(root, 'X-Content-Type-Options')).toBe('nosniff');
    expect(headerValue(root, 'Strict-Transport-Security')).toContain('max-age=');
    const csp = headerValue(root, 'Content-Security-Policy');
    expect(csp).toBeTruthy();
    const pp = headerValue(root, 'Permissions-Policy');
    expect(pp).toContain('geolocation=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('camera=()');
  });

  it('web/vercel.json includes required security headers', () => {
    const vercelPath = path.resolve(__dirname, '..', 'vercel.json');
    const config = loadVercelJson(vercelPath);
    const root = findRootRule(config.headers);
    expect(root).toBeTruthy();
    expect(headerValue(root, 'X-Frame-Options')).toBe('DENY');
    expect(headerValue(root, 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(headerValue(root, 'X-Content-Type-Options')).toBe('nosniff');
    expect(headerValue(root, 'Strict-Transport-Security')).toContain('max-age=');
    const csp = headerValue(root, 'Content-Security-Policy');
    expect(csp).toBeTruthy();
    const pp = headerValue(root, 'Permissions-Policy');
    expect(pp).toContain('geolocation=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('camera=()');
  });
});


