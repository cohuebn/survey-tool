alter table ${flyway:defaultSchema}.user_validation
  add column denied_reason text;
