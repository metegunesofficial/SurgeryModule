-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Surgeries table (minimal fields used by the app)
CREATE TABLE IF NOT EXISTS public.surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT NULL,
  patient_name TEXT NOT NULL,
  surgeon_id UUID NULL,
  room_id UUID NULL,
  procedure_type TEXT NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  estimated_duration INTEGER NOT NULL,
  notes TEXT NULL,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_surgeries_scheduled_start ON public.surgeries (scheduled_start);
CREATE INDEX IF NOT EXISTS idx_surgeries_status ON public.surgeries (status);


