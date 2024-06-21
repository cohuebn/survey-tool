"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../supabase/use-supabase-db";

import { Survey, SurveyFilters } from "./types";
import { getSurveys } from "./surveys";

export function useSurveys(filters: SurveyFilters) {
  const [surveysLoaded, setSurveysLoaded] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (surveysLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getSurveys(supabaseDb.client, filters).then((loadedSurveys) => {
      setSurveys(loadedSurveys);
      setSurveysLoaded(true);
    });
  }, [supabaseDb, filters, surveysLoaded]);

  return { surveys, surveysLoaded };
}
