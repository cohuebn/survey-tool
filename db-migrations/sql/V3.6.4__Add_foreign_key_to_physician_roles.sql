-- Add a foreign key between physician_roles and users

alter table ${flyway:defaultSchema}.physician_roles
  add constraint physician_roles_user_id_fk
  foreign key (user_id)
  references ${flyway:defaultSchema}.users (user_id)
  on delete cascade;