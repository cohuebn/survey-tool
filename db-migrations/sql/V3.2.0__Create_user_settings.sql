create table if not exists ${flyway:defaultSchema}.user_settings (
  user_id uuid not null references ${flyway:defaultSchema}.users(user_id),
  settings jsonb not null,
  primary key (user_id)
);

create index if not exists user_settings_user_id_idx on ${flyway:defaultSchema}.user_settings (user_id);
