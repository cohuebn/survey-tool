alter table ${flyway:defaultSchema}.user_validation
  add column email_address text not null;
