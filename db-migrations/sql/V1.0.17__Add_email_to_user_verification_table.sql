alter table ${flyway:defaultSchema}.user_validation
  add column if not exists email_address text not null;
