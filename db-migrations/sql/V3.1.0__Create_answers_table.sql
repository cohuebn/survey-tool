create table if not exists ${flyway:defaultSchema}.answers (
  id uuid not null,
  participant_id char(44) not null,
  survey_id uuid not null,
  question_id uuid not null,
  answer text not null,
  answer_time timestamptz not null,
  primary key (id)
);

create index if not exists answers_ptcpnt_survey_question_id_idx on ${flyway:defaultSchema}.answers (participant_id, survey_id, question_id);
create index if not exists answers_survey_question_id_idx on ${flyway:defaultSchema}.answers (survey_id, question_id);
