create or replace function jsonb_to_text_array(val jsonb)
  returns text[] as
$$
  select array_agg(v) from jsonb_array_elements_text(val) v
$$ language sql stable;
