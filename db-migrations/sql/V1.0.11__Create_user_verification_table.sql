create table if not exists ${flyway:defaultSchema}.user_validation (
  user_id uuid,
  submitted_timestamp timestamptz,
  npi_number bigint,
  primary key (user_id)
);

create index if not exists user_validation_idx on ${flyway:defaultSchema}.user_validation (npi_number);