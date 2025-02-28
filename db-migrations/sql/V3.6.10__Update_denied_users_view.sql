-- Update denied users to use physician_roles instead of profiles for location
-- Just grab one physician role for each denied user as that's sufficient
-- for reviewing denied users

create or replace view ${flyway:defaultSchema}.denied_users as
with denied_user_validations as (
  select
    uv.user_id,
    uv.submitted_timestamp,
    uv.npi_number,
    uv.email_address,
    uv.denied_timestamp,
    uv.denied_reason
  from ${flyway:defaultSchema}.user_validation uv
  where uv.denied_timestamp is not null
)
select distinct on (pr.user_id)
  duv.*,
  h.id as hospital_location,
  h.name as hospital_name,
  h.city as hospital_city,
  h.state as hospital_state,
  pr.department,
  pr.employment_type
from denied_user_validations duv
join ${flyway:defaultSchema}.physician_roles pr
  on duv.user_id = pr.user_id
left join ${flyway:defaultSchema}.hospitals h
  on pr.location = h.id;