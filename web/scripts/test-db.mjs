import { neon } from '@neondatabase/serverless';

async function testDatabaseConnection() {
    try {
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            console.error('❌ DATABASE_URL is not set');
            process.exit(1);
        }

        console.log('🔍 Testing database connection...');
        console.log('📍 URL:', databaseUrl.replace(/\/\/.*@/, '//***:***@'));

        const sql = neon(databaseUrl);

        // Test query
        const result = await sql`SELECT 1 as test`;
        console.log('✅ Database connection successful!');
        console.log('📊 Test result:', result);

        // Check if migrations table exists
        const migrationsCheck = await sql`SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = '_migrations'
        )`;
        console.log('🔄 Migrations table exists:', migrationsCheck[0].exists);

        if (migrationsCheck[0].exists) {
            const migrationCount = await sql`SELECT COUNT(*) as count FROM _migrations`;
            console.log('📈 Applied migrations:', migrationCount[0].count);
        }

    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testDatabaseConnection();
