-- Add metadata fields for overall ratings
alter table ${flyway:defaultSchema}.overall_ratings
  add column if not exists location uuid not null references ${flyway:defaultSchema}.hospitals(id),
  add column if not exists department text not null,
  add column if not exists employment_type text not null;