create or replace function public.get_aggregate_answers(
  survey_id_to_find uuid
)
returns table (
  question_id uuid,
  answer text,
  answer_count bigint
) as
$$
  select a.question_id, a.answer, count(1) as answer_count
  from answers a
  where a.survey_id = survey_id_to_find
  group by a.question_id, a.answer
$$ language sql stable;

comment on function public.get_aggregate_answers(uuid) is 'Get all aggregated answers for the given survey.';
