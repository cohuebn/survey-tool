alter table ${flyway:defaultSchema}.user_validation
  add column if not exists denied_reason text;
