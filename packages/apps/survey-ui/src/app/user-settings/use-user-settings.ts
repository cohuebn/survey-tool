import { useSupabaseQueryResult } from "../supabase/use-supabase-query-result";

import { getUserSettings } from "./database";

export function useUserSettings(userId: string | null | undefined) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getUserSettings,
    [userId],
    {},
  );
  return { userSettings: data, userSettingsLoaded: dataLoaded };
}
