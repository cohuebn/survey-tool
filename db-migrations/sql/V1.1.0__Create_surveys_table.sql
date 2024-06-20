create table if not exists ${flyway:defaultSchema}.surveys (
  id uuid,
  name text not null,
  subtitle text,
  description text,
  primary key (id)
);

create index if not exists surveys_name_idx on ${flyway:defaultSchema}.surveys (name);
create index if not exists surveys_search_idx on ${flyway:defaultSchema}.surveys using gin (to_tsvector('english', name || ' ' || subtitle || ' ' || description));
