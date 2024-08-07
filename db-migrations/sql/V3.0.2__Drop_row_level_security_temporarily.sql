drop policy if exists "Updates by authors and admins only" on ${flyway:defaultSchema}.surveys;
alter table ${flyway:defaultSchema}.surveys disable row level security;