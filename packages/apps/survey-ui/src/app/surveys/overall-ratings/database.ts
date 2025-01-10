import { toSnake } from "convert-keys";

import { OverallRating, SavableOverallRating } from "../types/overall-ratings";
import { AppSupabaseClient } from "../../supabase/types";
import { asPostgresError } from "../../errors/postgres-error";

export async function saveOverallRating(
  dbClient: AppSupabaseClient,
  overallRating: SavableOverallRating,
): Promise<OverallRating> {
  const dbOverallRating = toSnake(overallRating);
  const identifyingColumnsForUpsert = ["participant_id", "survey_id"].join(",");
  const { data, error } = await dbClient
    .from("overall_ratings")
    .upsert(dbOverallRating, {
      onConflict: identifyingColumnsForUpsert,
    })
    .select();
  if (error) throw asPostgresError(error);
  return data[0];
}

/**
 * Get all overall ratings for the given survey
 * @param dbClient The Supabase client
 * @param surveyId The id of the survey
 * @returns All overall ratings for the given survey
 */
export async function getOverallRatingsForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<OverallRating[]> {
  const { data, error } = await dbClient
    .from("overall_ratings")
    .select()
    .eq("survey_id", surveyId);
  if (error) throw asPostgresError(error);
  return data;
}
