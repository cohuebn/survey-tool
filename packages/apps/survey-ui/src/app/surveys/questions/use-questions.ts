"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { Question } from "../types";

import { getQuestionsForSurvey } from "./database";

export function useQuestions(surveyId: string) {
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (questionsLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getQuestionsForSurvey(supabaseDb.client, surveyId).then((loadedSurveys) => {
      setQuestions(loadedSurveys);
      setQuestionsLoaded(true);
    });
  }, [supabaseDb, surveyId, questionsLoaded]);

  return { questions, questionsLoaded };
}
