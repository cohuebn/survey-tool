create table if not exists ${flyway:defaultSchema}.survey_location_restrictions (
  id uuid,
  survey_id uuid not null references ${flyway:defaultSchema}.surveys(id),
  location_id uuid not null references ${flyway:defaultSchema}.hospitals(id),
  primary key (id)
);

create index if not exists slrestrictions_survey_id_idx on ${flyway:defaultSchema}.survey_location_restrictions (survey_id);
create index if not exists slrestrictions_location_id_idx on ${flyway:defaultSchema}.survey_location_restrictions (location_id);
