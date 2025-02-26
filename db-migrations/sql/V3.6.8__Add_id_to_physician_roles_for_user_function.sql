drop function ${flyway:defaultSchema}.get_physician_roles_for_user(uuid);

create or replace function ${flyway:defaultSchema}.get_physician_roles_for_user(
  user_id_to_find uuid
)
returns table (
  id uuid,
  user_id uuid,
  location uuid,
  hospital_name text,
  hospital_city text,
  hospital_state text,
  department text,
  employment_type text,
  created_timestamp timestamptz,
  validated_timestamp timestamptz
) as
$$
  select
    pr.id,
    pr.user_id,
    pr.location,
    h.name as hospital_name,
    h.city as hospital_city,
    h.state as hospital_state,
    pr.department,
    pr.employment_type,
    pr.created_timestamp,
    pr.validated_timestamp
  from ${flyway:defaultSchema}.physician_roles pr
  left join ${flyway:defaultSchema}.hospitals h on pr.location = h.id
  where pr.user_id = user_id_to_find;
$$ language sql stable;

comment on function public.get_physician_roles_for_user(uuid) is 'Get all physician roles for a user';
