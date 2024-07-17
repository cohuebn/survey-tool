"use client";

import { useSupabaseQueryResult } from "../../supabase/use-supabase-query-result";

import { getLocationRestrictionsForSurvey } from "./database";

export function useLocationRestrictions(surveyId: string) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getLocationRestrictionsForSurvey,
    [surveyId],
    [],
  );

  return {
    locationRestrictions: data,
    locationRestrictionsLoaded: dataLoaded,
  };
}
