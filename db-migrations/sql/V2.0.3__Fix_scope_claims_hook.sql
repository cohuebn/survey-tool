-- A Supabase hook function that adds all app roles to the claims object of the JWT token

create or replace function app_iam.add_scope_claims(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    claims jsonb;
    updated_app_metadata jsonb;
    updated_claims jsonb;
  begin
    claims := (select coalesce(event->'claims', '{}'::jsonb));
    -- Merge existing app_metadata with app roles; handle null app_metadata by creating an empty object
    updated_app_metadata := jsonb_set(
      coalesce(claims->'app_metadata', '{}'::jsonb),
      '{app_roles}',
      (
        select to_jsonb(array_agg(scope)) as app_roles
        from app_iam.scopes
        where user_id = (event->>'user_id')::uuid
      )
    );

    updated_claims := jsonb_set(claims, '{app_metadata}', updated_app_metadata);
    event := jsonb_set(event, '{claims}', updated_claims);

    return event;
  end;
$$;

grant execute
  on function app_iam.add_scope_claims
  to supabase_auth_admin, supabase_admin;

revoke execute
  on function app_iam.add_scope_claims
  from authenticated, anon, readonly, readwrite, public;