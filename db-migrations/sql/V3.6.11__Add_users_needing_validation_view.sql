-- Get all users requiring validation
-- Just grab one physician role for each denied user as that's sufficient
-- for reviewing denied users

create or replace view ${flyway:defaultSchema}.users_needing_validation as
with unvalidated_users as (
  select
    u.user_id,
    u.validated_timestamp,
    uv.submitted_timestamp,
    uv.npi_number,
    uv.email_address
  from ${flyway:defaultSchema}.user_validation uv
  join ${flyway:defaultSchema}.users u on uv.user_id = u.user_id
  where uv.denied_timestamp is null
  and u.validated_timestamp is null
)
select distinct on (uu.user_id)
  uu.*,
  h.id as hospital_location,
  h.name as hospital_name,
  h.city as hospital_city,
  h.state as hospital_state,
  pr.department,
  pr.employment_type
from unvalidated_users uu
join ${flyway:defaultSchema}.physician_roles pr
  on uu.user_id = pr.user_id
left join ${flyway:defaultSchema}.hospitals h
  on pr.location = h.id;