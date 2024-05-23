create table if not exists ${flyway:defaultSchema}.users (
  user_id uuid,
  validated_timestamp timestamptz,
  primary key (user_id)
);