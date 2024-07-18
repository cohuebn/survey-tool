"use client";

import { useSupabaseQueryResult } from "../../supabase/use-supabase-query-result";

import { getDepartmentRestrictionsForSurvey } from "./database";

export function useDepartmentRestrictions(surveyId: string) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getDepartmentRestrictionsForSurvey,
    [surveyId],
    [],
  );

  return {
    departmentRestrictions: data,
    departmentRestrictionsLoaded: dataLoaded,
  };
}
