"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { SurveySummary } from "../types";

import { getSurveySummary } from "./database";

export function useSurveySummary(surveyId: string) {
  const [surveySummaryLoaded, setSurveySummaryLoaded] = useState(false);
  const [surveySummary, setSurvey] = useState<SurveySummary | null>(null);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    setSurvey(null);
    setSurveySummaryLoaded(false);
  }, [surveyId]);

  useEffect(() => {
    if (surveySummaryLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getSurveySummary(supabaseDb.client, surveyId).then((loadedSurveys) => {
      setSurvey(loadedSurveys);
      setSurveySummaryLoaded(true);
    });
  }, [supabaseDb, surveySummaryLoaded, surveyId]);

  return { surveySummary, surveySummaryLoaded };
}
