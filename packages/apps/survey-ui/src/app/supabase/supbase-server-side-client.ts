import { getLazyLoadedSupabaseClient } from "@survey-tool/supabase";

import { getAppConfig } from "../config";

/**
 * Get a Supabase client in server-side code; unlike the client-side hooks, this avoids calling the API to get config
 * and just uses the config directly.
 */
export async function getServerSideSupabaseClient() {
  const config = getAppConfig();
  return getLazyLoadedSupabaseClient(config);
}
