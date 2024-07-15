create table if not exists ${flyway:defaultSchema}.survey_permissions (
  id uuid,
  survey_id uuid not null references ${flyway:defaultSchema}.surveys(id),
  is_public boolean not null,
  restrict_by_location boolean not null,
  restrict_by_department boolean not null,
  primary key (id)
);

create index if not exists survey_permissions_survey_id_idx on ${flyway:defaultSchema}.survey_permissions (survey_id);
