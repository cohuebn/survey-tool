"use client";

import { isNullOrUndefined } from "@survey-tool/core";

import { AppSupabaseClient } from "../../supabase/types";
import { useSupabaseQueryResult } from "../../supabase/use-supabase-query-result";

import { getLocationRestrictionsForSurvey } from "./database";

async function getLocationRestrictionsForNullableSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string | null,
) {
  if (isNullOrUndefined(surveyId)) return [];
  return getLocationRestrictionsForSurvey(dbClient, surveyId);
}

export function useLocationRestrictions(surveyId: string | null) {
  const { data, dataLoaded } = useSupabaseQueryResult(
    getLocationRestrictionsForNullableSurvey,
    [surveyId],
    [],
  );

  return {
    locationRestrictions: data,
    locationRestrictionsLoaded: dataLoaded,
  };
}
