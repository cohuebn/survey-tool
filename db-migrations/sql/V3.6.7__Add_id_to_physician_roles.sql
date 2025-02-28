alter table ${flyway:defaultSchema}.physician_roles
  drop constraint alternative_roles_pkey;

-- Add an id primary key column to the physician_roles table
alter table ${flyway:defaultSchema}.physician_roles
  add column id uuid primary key default uuid_generate_v4();