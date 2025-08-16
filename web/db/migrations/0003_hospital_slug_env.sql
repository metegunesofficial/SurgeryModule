-- Multi-tenant support: hospital slug and demo/live flag

ALTER TABLE hospitals
  ADD COLUMN IF NOT EXISTS slug varchar(100),
  ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Unique index on slug when provided
CREATE UNIQUE INDEX IF NOT EXISTS hospitals_slug_uq ON hospitals(slug) WHERE slug IS NOT NULL;


