create table if not exists app_iam.scopes (
  id uuid,
  user_id uuid,
  scope text,
  primary key (id)
);

create index if not exists scopes_user_id_idx on app_iam.scopes (user_id);
create index if not exists scopes_scope_idx on app_iam.scopes (scope);;