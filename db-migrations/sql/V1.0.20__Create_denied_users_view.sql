create or replace view ${flyway:defaultSchema}.denied_users as
select
  uv.user_id,
  uv.submitted_timestamp,
  uv.npi_number,
  uv.email_address,
  uv.denied_timestamp,
  uv.denied_reason,
  u.location as hospital_location,
  h.name as hospital_name,
  h.city as hospital_city,
  h.state as hospital_state,
  u.department,
  u.employment_type
from ${flyway:defaultSchema}.user_validation uv
left join ${flyway:defaultSchema}.users u
  on uv.user_id = u.user_id
left join ${flyway:defaultSchema}.hospitals h
  on u.location = h.id
where denied_timestamp is not null;