create table if not exists ${flyway:defaultSchema}.survey_question_types (
  id uuid,
  question_type text not null,
  primary key (id),
  unique (question_type)
);