create table if not exists ${flyway:defaultSchema}.survey_questions (
  id uuid,
  survey_id uuid not null references ${flyway:defaultSchema}.surveys(id),
  question_type_id uuid not null references ${flyway:defaultSchema}.survey_question_types(id),
  question text not null,
  definition jsonb not null,
  primary key (id)
);

create index if not exists survey_questions_survey_id_idx on ${flyway:defaultSchema}.survey_questions (survey_id);
