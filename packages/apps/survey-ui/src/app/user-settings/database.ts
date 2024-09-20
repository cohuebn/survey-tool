import { asPostgresError } from "../errors/postgres-error";
import { AppSupabaseClient } from "../supabase/supabase-context";
import { UserSettings } from "../surveys/types/user-settings";

export async function getUserSettings(
  dbClient: AppSupabaseClient,
  userId: string,
): Promise<UserSettings> {
  const query = dbClient
    .from("user_settings")
    .select(`settings`)
    .eq("user_id", userId)
    .maybeSingle<{ settings: UserSettings }>();
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data?.settings ?? {};
}

export async function saveUserSettings(
  dbClient: AppSupabaseClient,
  userId: string,
  settings: Record<string, unknown>,
) {
  const dbResult = await dbClient
    .from("user_settings")
    .upsert({ user_id: userId, settings });
  if (dbResult.error) throw asPostgresError(dbResult.error);
}
