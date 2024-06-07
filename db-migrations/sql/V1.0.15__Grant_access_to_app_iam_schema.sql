grant select on all tables in schema app_iam to readonly;
grant select on all sequences in schema app_iam to readonly;
grant usage on schema app_iam to readonly;
alter default privileges in schema app_iam grant select on tables to readonly;
alter default privileges in schema app_iam grant select on sequences to readonly;

do $$
begin
  if exists (select from pg_catalog.pg_roles where rolname = 'anon') then
    grant readonly to anon;
  end if;
end$$;

do $$
begin
  if exists (select from pg_catalog.pg_roles where rolname = 'authenticated') then
    grant readonly to authenticated;
  end if;
end$$;
