"use client";

import { isNullOrUndefined } from "@survey-tool/core";

import { AppSupabaseClient } from "../../supabase/types";
import { useSupabaseQueryResult } from "../../supabase/use-supabase-query-result";

import { getDepartmentRestrictionsForSurvey } from "./database";

async function getDepartmentRestrictionsForNullableSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string | null,
) {
  if (isNullOrUndefined(surveyId)) return [];
  return getDepartmentRestrictionsForSurvey(dbClient, surveyId);
}

export function useDepartmentRestrictions(surveyId: string | null) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getDepartmentRestrictionsForNullableSurvey,
    [surveyId],
    [],
  );

  return {
    departmentRestrictions: data,
    departmentRestrictionsLoaded: dataLoaded,
  };
}
