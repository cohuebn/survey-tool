# DB Migrations

Repeatable migrations using Flyway to get our database setup. Any database changes should go through here
to facilitate repeatable environments.

## Local run

To spin up a local Postgres database and run migrations against it, use this command:
`docker compose -f local.docker-compose.yml --env-file local.env up --build --force-recreate`

To tear down that local database, run:
`docker compose -f local.docker-compose.yml --env-file local.env down`

## Deployments

To run the migrations against a deployed database, take the following steps:

1. Ensure you've created a .env file that contains connection settings for the deployed database. I use
   the file `prod.env` as that is git-ignored so you don't need to worry about accidentally checking in
   secrets
2. Run the deployment docker compose file:
   `docker compose -f deployment.docker-compose.yml --env-file prod.env up --build --force-recreate`
