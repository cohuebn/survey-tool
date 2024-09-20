-- Purpose: Loosen the requirements for the metadata fields in the answers table
-- as we're not exactly certain if we'll always have this information for each user.
alter table ${flyway:defaultSchema}.answers
  alter column location drop not null,
  alter column department drop not null,
  alter column employment_type drop not null;