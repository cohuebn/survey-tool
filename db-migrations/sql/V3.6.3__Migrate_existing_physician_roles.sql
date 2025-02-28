insert into ${flyway:defaultSchema}.physician_roles
  (user_id, location, department, employment_type, created_timestamp, validated_timestamp)
select u.user_id, u.location, u.department, u.employment_type, uv.submitted_timestamp, u.validated_timestamp
from ${flyway:defaultSchema}.users u
join ${flyway:defaultSchema}.user_validation uv on u.user_id = uv.user_id;