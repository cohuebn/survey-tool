import { lazyLoad } from "@survey-tool/core";
import { createClient } from "@supabase/supabase-js";

import { SupabaseConfig } from "./types";

/**
 * Given Supabase options, get a lazy-loaded client
 * @param options The Supabase options to use for the app
 * @returns A lazy-loaded Supabase client using the provided options
 */
export function getLazyLoadedSupabaseClient(config: SupabaseConfig) {
  return lazyLoad(() => createClient(config.supabaseUrl, config.supabaseKey));
}
