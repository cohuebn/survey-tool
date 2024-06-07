import { toSnake } from "convert-keys";

import { AppSupabaseClient } from "../supabase/supabase-context";
import { asPostgresError } from "../errors/postgres-error";

import { DBUserProfile, UserProfile } from "./types";

export async function saveUserProfile(
  dbClient: AppSupabaseClient,
  userProfile: UserProfile,
) {
  const dbUserProfile = toSnake<DBUserProfile>(userProfile);
  const profileSaveResult = await dbClient.from("users").upsert(dbUserProfile);
  if (profileSaveResult.error) {
    throw asPostgresError(profileSaveResult.error);
  }
}
