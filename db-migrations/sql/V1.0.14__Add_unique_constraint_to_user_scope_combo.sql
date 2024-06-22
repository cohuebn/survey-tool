alter table app_iam.scopes drop constraint if exists scopes_user_id_scope_uq;
alter table app_iam.scopes add constraint scopes_user_id_scope_uq unique (user_id, scope);
