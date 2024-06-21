"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../supabase/use-supabase-db";

import { SurveySummary, SurveyFilters } from "./types";
import { getSurveys } from "./surveys";

export function useSurveySummaries(filters: SurveyFilters) {
  const [surveySummariesLoaded, setSurveySummariesLoaded] = useState(false);
  const [surveySummaries, setSurveySummaries] = useState<SurveySummary[]>([]);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (surveySummariesLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getSurveys(supabaseDb.client, filters).then((loadedSurveys) => {
      setSurveySummaries(loadedSurveys);
      setSurveySummariesLoaded(true);
    });
  }, [supabaseDb, filters, surveySummariesLoaded]);

  return { surveySummaries, surveySummariesLoaded };
}
