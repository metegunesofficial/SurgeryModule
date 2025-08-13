import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Pool } from '@neondatabase/serverless';

async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function getApplied(pool) {
  const result = await pool.query('SELECT id FROM _migrations ORDER BY applied_at ASC');
  return new Set(result.rows.map((r) => r.id));
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim().length === 0) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const migrationsDir = resolve(process.cwd(), 'db', 'migrations');
  const pool = new Pool({ connectionString });
  await ensureMigrationsTable(pool);
  const applied = await getApplied(pool);

  let entries = [];
  try {
    entries = await readdir(migrationsDir, { withFileTypes: true });
  } catch (e) {
    // No migrations dir; nothing to do
    await pool.end();
    console.log('No migrations to run.');
    return;
  }

  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith('.sql'))
    .map((e) => e.name)
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(join(migrationsDir, file), 'utf8');
    console.log(`Applying migration: ${file}`);
    await pool.query(sql);
    await pool.query('INSERT INTO _migrations (id) VALUES ($1)', [file]);
  }

  await pool.end();
  console.log('Migrations complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


