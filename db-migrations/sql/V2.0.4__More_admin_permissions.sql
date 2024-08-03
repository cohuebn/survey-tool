grant insert, update on all tables in schema app_iam to supabase_admin, supabase_auth_admin;
grant usage on all sequences in schema  app_iam to supabase_admin, supabase_auth_admin;
alter default privileges in schema app_iam grant insert, update on tables to supabase_admin, supabase_auth_admin;
alter default privileges in schema app_iam grant usage on sequences to supabase_admin, supabase_auth_admin;