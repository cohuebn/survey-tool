import { AppSupabaseClient } from "../supabase/supabase-context";
import { asPostgresError } from "../errors/postgres-error";

export async function deleteUserValidation(
  dbClient: AppSupabaseClient,
  userId: string,
) {
  const deleteResult = await dbClient
    .from("user_validation")
    .delete()
    .eq("user_id", userId);
  if (deleteResult.error) {
    throw asPostgresError(deleteResult.error);
  }
}
