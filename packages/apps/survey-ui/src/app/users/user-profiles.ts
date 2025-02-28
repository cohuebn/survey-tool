import { toCamel, toSnake } from "convert-keys";

import { AppSupabaseClient } from "../supabase/types";
import { asPostgresError } from "../errors/postgres-error";

import { DBUser, DBUserProfile, UserProfile } from "./types";

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

function dbUserToUserProfile(
  userId: string,
  dbUser: DBUser | null,
): UserProfile | null {
  return toCamel({ ...dbUser, userId });
}

export async function getUserProfile(
  dbClient: AppSupabaseClient,
  userId: string,
) {
  const dbResult = await dbClient
    .from("users")
    .select(
      `
          user_id,
          validated_timestamp
        `,
    )
    .eq("user_id", userId)
    .maybeSingle<DBUser>();
  return dbUserToUserProfile(userId, dbResult.data);
}
