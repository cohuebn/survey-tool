alter table ${flyway:defaultSchema}.survey_questions
  add column if not exists sort_order int not null default 0;