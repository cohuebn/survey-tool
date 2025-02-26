create index physician_roles_user_id_idx on ${flyway:defaultSchema}.physician_roles (user_id);
create index physician_roles_location_idx on ${flyway:defaultSchema}.physician_roles (location);
create index physician_roles_department_idx on ${flyway:defaultSchema}.physician_roles (department);