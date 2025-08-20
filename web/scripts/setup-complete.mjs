#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not set');
        console.error('💡 Please set DATABASE_URL environment variable');
        console.error('   Example: $env:DATABASE_URL = "postgresql://user:pass@host:port/db"');
        process.exit(1);
    }

    console.log('🚀 Starting complete database setup...');
    console.log('📍 Database URL configured');

    try {
        const sql = neon(databaseUrl);

        // Test connection
        console.log('🔍 Testing database connection...');
        await sql`SELECT 1`;
        console.log('✅ Database connection successful!');

        // Apply auth schema
        console.log('🔐 Applying auth schema...');
        const authSchemaPath = join(__dirname, '..', 'db', 'auth_schema.sql');
        const authSchema = readFileSync(authSchemaPath, 'utf8');
        await sql.unsafe(authSchema);
        console.log('✅ Auth schema applied successfully!');

        // Apply migrations
        console.log('🔄 Applying migrations...');
        const migrations = [
            '0001_init_auth.sql',
            '0002_core_schema.sql',
            '0003_hospital_slug_env.sql'
        ];

        for (const migration of migrations) {
            console.log(`   Applying ${migration}...`);
            const migrationPath = join(__dirname, '..', 'db', 'migrations', migration);
            const migrationSql = readFileSync(migrationPath, 'utf8');
            await sql.unsafe(migrationSql);
        }
        console.log('✅ All migrations applied successfully!');

        // Apply seed data (optional)
        if (process.env.NODE_ENV === 'development') {
            console.log('🌱 Applying seed data...');
            const seedPath = join(__dirname, 'seed.mjs');
            const { seed } = await import(seedPath);
            await seed(sql);
            console.log('✅ Seed data applied successfully!');
        }

        // Verify setup
        console.log('🔍 Verifying setup...');
        const tables = await sql`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `;
        console.log('📋 Tables created:', tables.map(t => t.table_name).join(', '));

        console.log('🎉 Database setup completed successfully!');
        console.log('✅ Your application is now fully ready!');

    } catch (error) {
        console.error('❌ Database setup failed:');
        console.error(error.message);
        process.exit(1);
    }
}

setupDatabase();
