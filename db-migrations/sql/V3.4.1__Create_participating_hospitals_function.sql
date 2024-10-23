create or replace function public.get_participating_hospitals(
  survey_id_to_find uuid
)
returns table (
  location_id uuid,
  hospital_name text,
  hospital_city text,
  hospital_state text,
  participant_count bigint
) as
$$
  select
    a.location,
    h.name,
    h.city,
    h.state,
    count(distinct a.participant_id) participant_count
  from answers a
  join hospitals h on a.location = h.id
  where a.survey_id = survey_id_to_find
  group by a.location, h.name, h.city, h.state;
$$ language sql stable;

comment on function public.get_participating_hospitals(uuid) is 'Get all hospitals where at least one person from that hospital has participated in a survey';
