-- Core domain schema for Surgery Module
-- Safe to run once; use migrations table for idempotence

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    address text,
    city varchar(100),
    country varchar(100),
    total_beds integer,
    total_ors integer,
    is_active boolean DEFAULT true,
    settings jsonb,
    created_at timestamptz DEFAULT now()
);

-- Departments (optional, referenced by users and ORs)
CREATE TABLE IF NOT EXISTS departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name varchar(150) NOT NULL,
    type varchar(50),
    head_of_department uuid,
    created_at timestamptz DEFAULT now()
);

-- Users (domain users; separate from auth_users)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) UNIQUE NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    role varchar(50) NOT NULL,
    hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_hospital_idx ON users(hospital_id);
CREATE INDEX IF NOT EXISTS users_department_idx ON users(department_id);

-- Operating Rooms
CREATE TABLE IF NOT EXISTS operating_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name varchar(100) NOT NULL,
    room_number varchar(20) NOT NULL,
    type varchar(50) NOT NULL,
    status varchar(50) DEFAULT 'available',
    capabilities jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS operating_rooms_unique_room ON operating_rooms(hospital_id, room_number);

-- Surgeries (basic scheduling)
CREATE TABLE IF NOT EXISTS surgeries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    or_id uuid NOT NULL REFERENCES operating_rooms(id) ON DELETE RESTRICT,
    patient_id varchar(100) NOT NULL,
    surgeon_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    procedure_name varchar(255) NOT NULL,
    scheduled_start timestamptz NOT NULL,
    scheduled_end timestamptz NOT NULL,
    actual_start timestamptz,
    actual_end timestamptz,
    status varchar(50) DEFAULT 'scheduled',
    priority varchar(20) DEFAULT 'routine',
    notes text,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS surgeries_hospital_idx ON surgeries(hospital_id);
CREATE INDEX IF NOT EXISTS surgeries_or_idx ON surgeries(or_id);
CREATE INDEX IF NOT EXISTS surgeries_time_idx ON surgeries(scheduled_start, scheduled_end);


