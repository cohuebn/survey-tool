alter table ${flyway:defaultSchema}.surveys
  add column if not exists owner_id uuid references ${flyway:defaultSchema}.users(user_id);

create index if not exists surveys_owner_id_idx on ${flyway:defaultSchema}.surveys (owner_id);