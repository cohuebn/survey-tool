import { asPostgresError } from "../errors/postgres-error";
import { AppSupabaseClient } from "../supabase/types";

export async function getUserScopes(
  dbClient: AppSupabaseClient,
  userId: string,
): Promise<string[]> {
  const query = dbClient
    .schema("app_iam")
    .from("scopes")
    .select("scope")
    .eq("user_id", userId);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data?.map((x) => x.scope) ?? [];
}
