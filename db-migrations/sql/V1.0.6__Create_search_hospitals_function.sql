create or replace function public.search_hospitals(
  search_term text
)
returns table (
  id uuid,
  name text,
  city text,
  state text
) as
$$
  with vectorized_hospitals as (
    select
      h.id,
      h.name,
      h.city,
      h.state,
      to_tsvector(concat_ws(' ', h.name, h.city, h.state)) searchable_document
    from hospitals h
  )
  select
    h.id,
    h.name,
    h.city,
    h.state
  from vectorized_hospitals h
  where h.searchable_document @@ to_tsquery(search_term)
  order by ts_rank_cd(h.searchable_document, to_tsquery(search_term)) desc;
$$ language sql stable;

comment on function public.search_hospitals(text) is 'Search for hospitals by name, city, & state. The provided "search_term" can be any valid Postgres tsquery to use for searching.';
