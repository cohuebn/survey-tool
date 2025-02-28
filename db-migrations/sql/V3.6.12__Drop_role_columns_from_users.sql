-- Roles have been separated into their own table, so we no longer need these columns in the users table

alter table ${flyway:defaultSchema}.users
  drop column if exists location,
  drop column if exists department,
  drop column if exists employment_type;