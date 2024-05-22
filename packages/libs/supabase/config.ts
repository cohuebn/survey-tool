import { getRequired } from "@survey-tool/core";

import { SupabaseConfig } from "./types";

export function getSupabaseConfigFromEnvironment(): SupabaseConfig {
  return {
    supabaseUrl: getRequired("SUPABASE_URL"),
    supabaseKey: getRequired("SUPABASE_KEY"),
  };
}
