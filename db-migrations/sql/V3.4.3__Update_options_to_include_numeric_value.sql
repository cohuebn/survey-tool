with options as (
  select
    q.id as question_id,
    o.value,
    o.numeric_value 
  from survey_questions q,
  lateral jsonb_array_elements(q.definition->'options') with ordinality as o(value, numeric_value)
  where q.definition ? 'options'
),
option_objects as (
  select
    o.question_id,
    json_build_object('value', o.value, 'numericValue', o.numeric_value) as option
  from options o
),
updated_options as (
  select
    oo.question_id,
    jsonb_agg(oo.option order by oo.option->>'numericValue') options
  from option_objects oo
  group by question_id
)
update survey_questions q
set definition = jsonb_set(definition, '{option}', o.options)
from updated_options o
where q.id = o.question_id;