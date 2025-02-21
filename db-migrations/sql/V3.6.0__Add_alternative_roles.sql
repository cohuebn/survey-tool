create table if not exists ${flyway:defaultSchema}.alternative_roles (
  user_id uuid,
  location uuid,
  department text,
  employment_type text,
  created_timestamp timestamptz not null,
  validated_timestamp timestamptz,
  primary key (user_id, location, department)
);