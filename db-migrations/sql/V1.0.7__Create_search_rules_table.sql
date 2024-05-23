create table if not exists ${flyway:defaultSchema}.search_rules (
  search_in tsquery primary key,
  search_out tsquery
);