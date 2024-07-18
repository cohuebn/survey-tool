create table if not exists ${flyway:defaultSchema}.survey_department_restrictions (
  id uuid,
  survey_id uuid not null references ${flyway:defaultSchema}.surveys(id),
  department text not null,
  primary key (id)
);

create index if not exists sdrestrictions_survey_id_idx on ${flyway:defaultSchema}.survey_department_restrictions (survey_id);
create index if not exists sdrestrictions_location_id_idx on ${flyway:defaultSchema}.survey_department_restrictions (department);
