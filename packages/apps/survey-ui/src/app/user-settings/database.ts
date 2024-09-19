import { asPostgresError } from "../errors/postgres-error";
import { AppSupabaseClient } from "../supabase/supabase-context";

export async function getUserSettings(
  dbClient: AppSupabaseClient,
  userId: string,
): Promise<Record<string, unknown>> {
  const query = dbClient
    .from("user_settings")
    .select(
      `
      user_id,
      settings,
    `,
    )
    .eq("user_id", userId)
    .maybeSingle<Record<string, unknown>>();
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data ?? {};
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
