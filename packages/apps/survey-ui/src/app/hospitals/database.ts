import { toCamel } from "convert-keys";

import { asPostgresError } from "../errors/postgres-error";
import { AppSupabaseClient } from "../supabase/types";

import { Hospital } from "./types";

/**
 * Get hospitals with the given location ids from the database
 * @param dbClient The Supabase client
 * @param locationIds The location ids of the hospitals
 */
export async function getHospitalsByIds(
  dbClient: AppSupabaseClient,
  locationIds: string[],
): Promise<Hospital[]> {
  const query = dbClient
    .from("hospitals")
    .select(
      `
      id,
      name,
      city,
      state
    `,
    )
    .in("id", locationIds);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<Hospital>);
}
