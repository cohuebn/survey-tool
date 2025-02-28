import { toCamel, toSnake } from "convert-keys";
import { omitUndefinedAndNullProperties } from "@survey-tool/core";

import { AppSupabaseClient } from "../../supabase/types";
import { asPostgresError } from "../../errors/postgres-error";
import { SurveySummary, SurveyFilters, DBSurveySummary } from "../types";

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

/** Get all survey summaries, potentially restricted by owner.
 * This function is useful in non-survey-taking contexts (authoring, reviewing, etc).
 * @param dbClient The Supabase client to use.
 * @param filters The filters to apply to the query. If `ownerId` is set, only surveys
 * owned by that user will be returned.
 * @returns A list of matching survey summaries.
 */
export async function getSurveySummaries(
  dbClient: AppSupabaseClient,
  filters: SurveyFilters,
): Promise<SurveySummary[]> {
  const query = getQuery(dbClient, filters);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<SurveySummary>);
}

/** Get survey summaries available to the given user. This function filters
 * the list of surveys based on the user's department and location
 * This function is useful in survey-taking contexts.
 * @param dbClient The Supabase client to use.
 * @param userId The id of the user to get surveys for.
 * @returns A list of matching survey summaries.
 */
export async function getUserRestrictedSurveySummaries(
  dbClient: AppSupabaseClient,
  userId: string,
  surveyId?: string,
): Promise<SurveySummary[]> {
  const query = dbClient.rpc(
    "get_survey_summaries_for_user",
    omitUndefinedAndNullProperties({
      user_id_to_find: userId,
      survey_id_to_find: surveyId,
    }),
  );
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<SurveySummary>);
}

/** Determine if the given user has permission to take the given survey */
export async function doesUserHaveSurveyTakingPermission(
  dbClient: AppSupabaseClient,
  userId: string,
  surveyId: string,
): Promise<boolean> {
  const surveySearchResult = await getUserRestrictedSurveySummaries(
    dbClient,
    userId,
    surveyId,
  );
  return surveySearchResult.length > 0;
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

/** Delete the given survey along with all dependencies of that survey */
export async function deleteSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
) {
  const dependencies = await Promise.all([
    dbClient.from("answers").delete().eq("survey_id", surveyId),
    dbClient.from("overall_ratings").delete().eq("survey_id", surveyId),
    dbClient
      .from("survey_department_restrictions")
      .delete()
      .eq("survey_id", surveyId),
    dbClient
      .from("survey_location_restrictions")
      .delete()
      .eq("survey_id", surveyId),
    dbClient.from("survey_permissions").delete().eq("survey_id", surveyId),
    dbClient.from("survey_questions").delete().eq("survey_id", surveyId),
  ]);
  const surveyDeletion = await dbClient
    .from("surveys")
    .delete()
    .eq("id", surveyId);
  const error =
    dependencies.find((dependency) => dependency.error)?.error ||
    surveyDeletion.error;
  if (error) throw asPostgresError(error);
}
