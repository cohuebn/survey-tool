alter table ${flyway:defaultSchema}.overall_ratings drop constraint overall_ratings_pkey;
drop index if exists ${flyway:defaultSchema}.overall_ratings_pkey;
alter table ${flyway:defaultSchema}.overall_ratings drop column id;
alter table ${flyway:defaultSchema}.overall_ratings add primary key (participant_id, survey_id);