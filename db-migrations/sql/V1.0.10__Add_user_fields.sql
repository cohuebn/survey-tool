alter table ${flyway:defaultSchema}.users
  add column if not exists location uuid references ${flyway:defaultSchema}.hospitals(id),
  add column if not exists department text,
  add column if not exists employment_type text;

create index if not exists users_location_department_idx on ${flyway:defaultSchema}.users (location, department);
create index if not exists users_department_idx on ${flyway:defaultSchema}.users (department);