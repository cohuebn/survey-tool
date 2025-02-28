drop function public.get_survey_summaries_for_user;

create or replace function public.get_survey_summaries_for_user(
  user_id_to_find uuid,
  survey_id_to_find uuid default null
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
    cross join physician_roles pr
    where (survey_id_to_find is null or s.id = survey_id_to_find)
    and (sp.is_public or sp.restrict_by_location = false or pr.location = slr.location_id)
    and (sp.is_public or sp.restrict_by_department = false or pr.department = sdr.department)
    and pr.user_id = user_id_to_find
  )
  select distinct on (m.id) m.id, m.name, m.subtitle, m.description, m.owner_id
  from matches m;
$$ language sql stable;

comment on function public.get_survey_summaries_for_user(uuid, uuid) is 'Get all surveys that the user has access to. Optionally, provide a survey_id to limit the results to a single survey.';
