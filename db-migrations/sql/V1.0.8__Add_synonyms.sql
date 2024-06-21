insert into ${flyway:defaultSchema}.search_rules
values
  ('cancer', '(cancer | oncology)'),
  ('heart', '(heart | cardiac)'),
  ('st.', '(st. | st | saint)'),
  ('st', '(st. | st | saint)'),
  ('saint', '(st. | st | saint)')
on conflict (search_in) do nothing;