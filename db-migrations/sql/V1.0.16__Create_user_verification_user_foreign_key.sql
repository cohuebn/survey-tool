alter table ${flyway:defaultSchema}.user_validation drop constraint if exists user_validation_user_id_fk;
alter table ${flyway:defaultSchema}.user_validation
  add constraint user_validation_user_id_fk
  foreign key (user_id) references ${flyway:defaultSchema}.users(user_id);