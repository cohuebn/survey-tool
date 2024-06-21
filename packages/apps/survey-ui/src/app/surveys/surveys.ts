import { toCamel, toSnake } from "convert-keys";

import { AppSupabaseClient } from "../supabase/supabase-context";
import { asPostgresError } from "../errors/postgres-error";

import { SurveySummary, SurveyFilters, DBSurveySummary } from "./types";

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

export async function getSurveySummaries(
  dbClient: AppSupabaseClient,
  filters: SurveyFilters,
): Promise<SurveySummary[]> {
  const query = getQuery(dbClient, filters);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<SurveySummary>);
}

export async function getSurveySummary(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<SurveySummary | null> {
  const dbResult = await dbClient
    .from("surveys")
    .select(
      `
      id,
      name,
      subtitle,
      description,
      owner_id
    `,
    )
    .eq("id", surveyId)
    .maybeSingle();
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data ? toCamel(dbResult.data) : null;
}

export async function saveSurveySummary(
  dbClient: AppSupabaseClient,
  summary: SurveySummary,
) {
  const dbSummary = toSnake<DBSurveySummary>(summary);
  const dbResult = await dbClient.from("surveys").upsert(dbSummary);
  if (dbResult.error) throw asPostgresError(dbResult.error);
}
