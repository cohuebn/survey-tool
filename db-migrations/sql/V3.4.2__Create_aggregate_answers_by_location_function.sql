create or replace function public.get_aggregate_answers_by_location(
  survey_id_to_find uuid,
  locations_to_find uuid[]
)
returns table (
  location_id uuid,
  question_id uuid,
  answer text,
  answer_count bigint
) as
$$
  select a.location, a.question_id, a.answer, count(1) as answer_count
  from answers a
  where a.survey_id = survey_id_to_find
  and (locations_to_find is null or a.location = any(locations_to_find))
  group by a.location, a.question_id, a.answer
$$ language sql stable;

comment on function public.get_aggregate_answers_by_location(uuid, uuid[]) is 'Get all aggregated answers for the given survey at the given locations. If locations are null, return results for all locations.';
