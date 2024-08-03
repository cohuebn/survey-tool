-- Create built-in Supabase roles in local Postgres environment to better
-- emulate supabase behavior in production.

do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = 'supabase_admin') then
    create role supabase_admin with superuser;
  end if;
end$$;

do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = 'supabase_auth_admin') then
    create role supabase_auth_admin with superuser;
  end if;
end$$;

do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = 'authenticated') then
    create role authenticated;
    grant "readwrite" to authenticated;
  end if;
end$$;

do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = 'anon') then
    create role anon;
    grant connect on database ${flyway:database} to anon;
  end if;
end$$;