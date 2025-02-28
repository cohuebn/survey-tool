"use client";

import { isNullOrUndefined } from "@survey-tool/core";

import { AppSupabaseClient } from "../../supabase/types";
import { useSupabaseQueryResult } from "../../supabase/use-supabase-query-result";

import { getPermissionsForSurvey } from "./database";

async function getPermissionsForNullableSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string | null,
) {
  if (isNullOrUndefined(surveyId)) return null;
  return getPermissionsForSurvey(dbClient, surveyId);
}

export function useSurveyPermissions(surveyId: string | null) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getPermissionsForNullableSurvey,
    [surveyId],
    null,
  );

  return { permissions: data, permissionsLoaded: dataLoaded };
}
