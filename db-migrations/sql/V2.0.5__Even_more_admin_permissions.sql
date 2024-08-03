-- Whoops forgot "select" permission

grant select on all tables in schema app_iam to supabase_admin, supabase_auth_admin;
alter default privileges in schema app_iam grant select on tables to supabase_admin, supabase_auth_admin;