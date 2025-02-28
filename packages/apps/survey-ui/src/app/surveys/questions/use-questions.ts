"use client";

import { useEffect, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { Question } from "../types";

import { getQuestionsForSurvey } from "./database";

export function useQuestions(surveyId: string | null) {
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    setQuestions([]);
    setQuestionsLoaded(false);
  }, [surveyId]);

  useEffect(() => {
    if (isNullOrUndefined(surveyId)) {
      setQuestionsLoaded(true);
      return;
    }
    if (questionsLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getQuestionsForSurvey(supabaseDb.client, surveyId).then((loadedSurveys) => {
      setQuestions(loadedSurveys);
      setQuestionsLoaded(true);
    });
  }, [supabaseDb, surveyId, questionsLoaded]);

  return { questions, questionsLoaded };
}
