"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../supabase/use-supabase-db";

import { QuestionType } from "./types";
import { getQuestionTypes } from "./question-types";

export function useQuestionTypes() {
  const [questionTypesLoaded, setQuestionTypesLoaded] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (questionTypesLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getQuestionTypes(supabaseDb.client).then((loadedQuestionTypes) => {
      setQuestionTypes(loadedQuestionTypes);
      setQuestionTypesLoaded(true);
    });
  }, [supabaseDb, questionTypesLoaded]);

  return { questionTypes, questionTypesLoaded };
}
