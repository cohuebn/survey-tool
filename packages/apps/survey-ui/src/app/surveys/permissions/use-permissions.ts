"use client";

import { useSupabaseQueryResult } from "../../supabase/use-supabase-query-result";

import { getPermissionsForSurvey } from "./database";

export function useSurveyPermissions(surveyId: string) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getPermissionsForSurvey,
    [surveyId],
    null,
  );

  return { permissions: data, permissionsLoaded: dataLoaded };
}
