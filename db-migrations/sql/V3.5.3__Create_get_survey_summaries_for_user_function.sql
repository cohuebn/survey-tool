create or replace function public.get_survey_summaries_for_user(
  user_id uuid
)
returns table (
  id uuid,
  name text,
  subtitle text,
  description text,
  owner_id uuid
) as
$$
  with matches as (
    select s.id, s.name, s.subtitle, s.description, s.owner_id
    from surveys s
    join survey_permissions sp on s.id = sp.survey_id
    left join survey_location_restrictions slr on s.id = slr.survey_id
    left join survey_department_restrictions sdr on s.id = sdr.survey_id
    cross join users u
    where (sp.is_public or sp.restrict_by_location = false or u.location = slr.location_id)
    and (sp.is_public or sp.restrict_by_department = false or u.department = sdr.department)
    and u.user_id = user_id
  )
  select distinct on (m.id) m.id, m.name, m.subtitle, m.description, m.owner_id
  from matches m;
$$ language sql stable;

comment on function public.get_aggregate_answers_by_location(uuid, uuid[]) is 'Get all aggregated answers for the given survey at the given locations. If locations are null, return results for all locations.';
