import { toSnake } from "convert-keys";

import { OverallRating, SavableOverallRating } from "../types/overall-ratings";
import { AppSupabaseClient } from "../../supabase/supabase-context";
import { asPostgresError } from "../../errors/postgres-error";

export async function saveOverallRating(
  dbClient: AppSupabaseClient,
  overallRating: SavableOverallRating,
): Promise<OverallRating> {
  const dbOverallRating = toSnake(overallRating);
  const { data, error } = await dbClient
    .from("overall_ratings")
    .upsert(dbOverallRating)
    .select();
  if (error) throw asPostgresError(error);
  return data[0];
}
