drop policy if exists "Updates by authors and admins only" on ${flyway:defaultSchema}.surveys;

create policy "Updates by authors and admins only"
on ${flyway:defaultSchema}.surveys for update
to authenticated
using (
  (select auth.uid()) = owner_id
  or 'admin' = any(jsonb_to_text_array(
    (select auth.jwt()->'app_metadata'->'app_roles')
  ))
);