import { toCamel } from "convert-keys";

import { AppSupabaseClient } from "../supabase/supabase-context";
import { asPostgresError } from "../errors/postgres-error";

import { Survey, SurveyFilters } from "./types";

function getQuery(dbClient: AppSupabaseClient, filters: SurveyFilters) {
  const baseQuery = dbClient.from("surveys").select(`
      id,
      name,
      subtitle,
      description,
      owner_id
    `);
  return filters.ownerId
    ? baseQuery.eq("owner_id", filters.ownerId)
    : baseQuery;
}

export async function getSurveys(
  dbClient: AppSupabaseClient,
  filters: SurveyFilters,
): Promise<Survey[]> {
  const query = getQuery(dbClient, filters);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<Survey>);
}
