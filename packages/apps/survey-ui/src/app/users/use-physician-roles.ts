import { useSupabaseQueryResult } from "../supabase/use-supabase-query-result";

import { getPhysicianRolesForUser } from "./database";

export function usePhysicianRoles(userId: string | undefined) {
  const { data: physicianRoles, dataLoaded: physicianRolesLoaded } =
    useSupabaseQueryResult(getPhysicianRolesForUser, [userId], null);
  return { physicianRoles: physicianRoles ?? [], physicianRolesLoaded };
}
