-- Add a foreign key between physician_roles and hospitals

alter table ${flyway:defaultSchema}.physician_roles
  add constraint physician_roles_location_fk
  foreign key (location)
  references ${flyway:defaultSchema}.hospitals (id)
  on delete cascade;