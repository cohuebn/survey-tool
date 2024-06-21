insert into ${flyway:defaultSchema}.survey_question_types (id, question_type)
values
  ('36879d6f-464e-4d71-ba18-6b937b871eb2', 'Rating'),
  ('9ff72bd0-b478-4c59-b12f-c33c0d6c50af', 'Multiple choice'),
  ('0c620b1b-a08a-4b77-a0b5-efb374bf53a3', 'Yes/no'),
  ('42806fcc-666f-4099-9011-fe486473dd50', 'Free-form'),
  ('e533daec-9662-4741-89ac-970f3c775993', 'Ranking')
on conflict (id) do nothing;