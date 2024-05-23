create table if not exists ${flyway:defaultSchema}.hospitals (
  id uuid,
  name text,
  city text,
  state text,
  primary key (id)
);

create index if not exists hospitals_name_idx on ${flyway:defaultSchema}.hospitals (name);
create index if not exists hospitals_city_state_idx on ${flyway:defaultSchema}.hospitals (city, state);