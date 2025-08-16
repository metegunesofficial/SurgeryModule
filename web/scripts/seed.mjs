import { resolve } from 'node:path';

async function getPool(connectionString) {
  if (/neon\.tech/.test(connectionString)) {
    const { Pool } = await import('@neondatabase/serverless');
    return new Pool({ connectionString });
  }
  const pg = await import('pg');
  return new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
}

async function upsert(pool, query, params = []) {
  await pool.query(query, params);
}

async function exists(pool, query, params = []) {
  const r = await pool.query(query, params);
  return r.rowCount > 0;
}

async function seed() {
  // Prevent accidental seeding in production unless explicitly allowed
  if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PROD !== 'true') {
    console.error('Refusing to run seed in production. Set SEED_ALLOW_PROD=true to override.');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim().length === 0) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }
  const pool = await getPool(connectionString);
  try {
    console.log('Seeding core domain data...');

    // Hospital (LIVE)
    const hospitalId = '00000000-0000-0000-0000-000000000001';
    if (!(await exists(pool, 'select 1 from hospitals where id = $1', [hospitalId]))) {
      await upsert(
        pool,
        `insert into hospitals (id, name, address, city, country, total_beds, total_ors, is_active, settings)
         values ($1, $2, $3, $4, $5, $6, $7, true, $8)`,
        [
          hospitalId,
          'Acme Hastanesi Kadıköy',
          'Fenerbahçe Mah. Hastane Cad. No:123',
          'İstanbul',
          'Türkiye',
          250,
          12,
          { timezone: 'Europe/Istanbul', language: 'tr-TR', currency: 'TRY' },
        ]
      );
      console.log('✓ hospitals');
    }

    // Demo Clinic (DEMO)
    const demoId = '00000000-0000-0000-0000-00000000DEMO';
    if (!(await exists(pool, 'select 1 from hospitals where id = $1', [demoId]))) {
      await upsert(
        pool,
        `insert into hospitals (id, name, slug, is_demo, is_active, settings)
         values ($1, $2, $3, true, true, $4)` ,
        [
          demoId,
          'Surgery Module Demo Klinik',
          'demo',
          { timezone: 'Europe/Istanbul', language: 'tr-TR', currency: 'TRY' },
        ]
      );
      console.log('✓ hospitals (demo)');
    }

    // Department
    const deptId = '00000000-0000-0000-0000-00000000C001';
    if (!(await exists(pool, 'select 1 from departments where id = $1', [deptId]))) {
      await upsert(
        pool,
        `insert into departments (id, hospital_id, name, type)
         values ($1, $2, $3, $4)`,
        [deptId, hospitalId, 'Kalp ve Damar Cerrahisi', 'SURGICAL']
      );
      console.log('✓ departments');
    }

    // Users
    const adminId = '00000000-0000-0000-0000-0000000000A1';
    if (!(await exists(pool, 'select 1 from users where id = $1', [adminId]))) {
      await upsert(
        pool,
        `insert into users (id, email, first_name, last_name, role, hospital_id, is_active)
         values ($1, $2, $3, $4, $5, $6, true)`,
        [adminId, 'admin@acmehospital.com', 'Ahmet', 'Yılmaz', 'hospital_admin', hospitalId]
      );
      console.log('✓ users (admin)');
    }

    const surgeonId = '00000000-0000-0000-0000-0000000000S2';
    if (!(await exists(pool, 'select 1 from users where id = $1', [surgeonId]))) {
      await upsert(
        pool,
        `insert into users (id, email, first_name, last_name, role, hospital_id, department_id, is_active)
         values ($1, $2, $3, $4, $5, $6, $7, true)`,
        [
          surgeonId,
          'dr.mehmet@acmehospital.com',
          'Dr. Mehmet',
          'Özkan',
          'surgeon',
          hospitalId,
          deptId,
        ]
      );
      console.log('✓ users (surgeon)');
    }

    // Operating Room
    const orId = '00000000-0000-0000-0000-0000000000OR';
    if (!(await exists(pool, 'select 1 from operating_rooms where id = $1', [orId]))) {
      await upsert(
        pool,
        `insert into operating_rooms (id, hospital_id, name, room_number, type, status, capabilities, is_active)
         values ($1, $2, $3, $4, $5, 'available', $6, true)`,
        [
          orId,
          hospitalId,
          'Ameliyathane 1',
          'OR-01',
          'cardiac',
          ['Open Heart Surgery', 'Minimally Invasive', 'Robotic Surgery'],
        ]
      );
      console.log('✓ operating_rooms');
    }

    // Surgery (scheduled)
    const surgeryId = '00000000-0000-0000-0000-0000000000SU';
    if (!(await exists(pool, 'select 1 from surgeries where id = $1', [surgeryId]))) {
      await upsert(
        pool,
        `insert into surgeries (
           id, hospital_id, or_id, patient_id, surgeon_id, procedure_name, scheduled_start, scheduled_end, status, priority, notes
         ) values ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled', 'elective', $9)
        `,
        [
          surgeryId,
          hospitalId,
          orId,
          'patient-001',
          surgeonId,
          'Koroner Bypass (CABG)',
          new Date('2025-08-17T08:00:00Z'),
          new Date('2025-08-17T12:00:00Z'),
          'Triple vessel disease, EF: 45%',
        ]
      );
      console.log('✓ surgeries');
    }

    console.log('Seed complete.');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});


