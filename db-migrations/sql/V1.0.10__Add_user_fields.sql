alter table ${flyway:defaultSchema}.users
  add column location uuid references ${flyway:defaultSchema}.hospitals(id),
  add column department text,
  add column employment_type text;

create index if not exists users_location_department_idx on ${flyway:defaultSchema}.users (location, department);
create index if not exists users_department_idx on ${flyway:defaultSchema}.users (department);