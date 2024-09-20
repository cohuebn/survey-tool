-- Purpose: Ensure uuids for locations are valid according to the hospitals table.
alter table ${flyway:defaultSchema}.answers
drop column location;

alter table ${flyway:defaultSchema}.answers
add column location uuid references ${flyway:defaultSchema}.hospitals(id);