create table if not exists ${flyway:defaultSchema}.overall_ratings (
  id uuid not null,
  participant_id char(44) not null,
  survey_id uuid not null,
  rating numeric not null,
  rating_time timestamptz not null,
  primary key (id)
);

create index if not exists orating_survey_idx on ${flyway:defaultSchema}.overall_ratings (survey_id);
create index if not exists orating_participant_survey_idx on ${flyway:defaultSchema}.overall_ratings (participant_id, survey_id);
