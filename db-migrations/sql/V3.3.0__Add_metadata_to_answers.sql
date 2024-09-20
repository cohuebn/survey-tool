alter table if exists ${flyway:defaultSchema}.answers
  add column if not exists location uuid not null,
  add column if not exists department text not null,
  add column if not exists employment_type text not null;