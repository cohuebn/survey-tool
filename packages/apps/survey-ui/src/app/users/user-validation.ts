import { toSnake } from "convert-keys";

import { AppSupabaseClient } from "../supabase/types";
import { asPostgresError } from "../errors/postgres-error";

import { DBUserValidation, UserValidation } from "./types";

export async function deleteUserValidation(
  dbClient: AppSupabaseClient,
  userId: string,
) {
  const deleteResult = await dbClient
    .from("user_validation")
    .delete()
    .eq("user_id", userId);
  if (deleteResult.error) throw asPostgresError(deleteResult.error);
}

export async function saveUserValidation(
  dbClient: AppSupabaseClient,
  userValidation: UserValidation,
) {
  const dbUserValidation = toSnake<DBUserValidation>(userValidation);
  const saveResult = await dbClient
    .from("user_validation")
    .upsert(dbUserValidation);
  if (saveResult.error) {
    throw asPostgresError(saveResult.error);
  }
}
