import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from '@neondatabase/serverless';

async function main() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString || connectionString.trim().length === 0) {
		console.error('DATABASE_URL is not set');
		process.exit(1);
	}

	const pool = new Pool({ connectionString });
	const schemaPath = resolve(process.cwd(), 'db', 'auth_schema.sql');
	const content = await readFile(schemaPath, 'utf8');
	// naive split by semicolon followed by newline; safe for our simple schema
	const statements = content
		.split(/;\s*\n/g)
		.map((s) => s.trim())
		.filter(Boolean);

	for (const stmt of statements) {
		await pool.query(stmt);
	}

	await pool.end();
	console.log('Auth schema applied.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});


