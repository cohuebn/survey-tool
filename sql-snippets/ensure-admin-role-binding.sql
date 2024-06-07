insert into app_iam.scopes (id, user_id, scope)
values(gen_random_uuid, 'e8451f0e-ee82-48f2-8d8c-234f022f8b23', 'admin')
on conflict (user_id, scope) do nothing;