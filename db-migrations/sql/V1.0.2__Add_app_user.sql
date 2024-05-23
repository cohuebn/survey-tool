do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = '${appUser}') then
    create role ${appUser};
  end if;
  alter role ${appUser} with password '${appPassword}' login;
end$$;

grant readwrite to ${appUser}
