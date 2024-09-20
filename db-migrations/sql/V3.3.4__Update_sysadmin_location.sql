update ${flyway:defaultSchema}.hospitals
set name = 'System admin (application testing)'
where id = '28acf2a6-3987-40ea-a3c1-da2240d843a8'; -- known uuid for the system admin location