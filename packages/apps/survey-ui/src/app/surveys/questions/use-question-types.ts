"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { QuestionType } from "../types";
import { AppSupabaseClient } from "../../supabase/types";

import { getQuestionTypes } from "./question-types";

// Because question types are not expected to change frequently, we can load them once and cache them.
let lazyLoadedQuestionTypes: Promise<QuestionType[]> | undefined;

export function useQuestionTypes() {
  const [questionTypesLoaded, setQuestionTypesLoaded] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const supabaseDb = useSupabaseDb();

  const lazyLoadQuestionTypes = (dbClient: AppSupabaseClient) => {
    if (!lazyLoadedQuestionTypes) {
      lazyLoadedQuestionTypes = getQuestionTypes(dbClient);
    }
    return lazyLoadedQuestionTypes;
  };

  useEffect(() => {
    if (questionTypesLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    lazyLoadQuestionTypes(supabaseDb.client).then((loadedQuestionTypes) => {
      setQuestionTypes(loadedQuestionTypes);
      setQuestionTypesLoaded(true);
    });
  }, [supabaseDb, questionTypesLoaded]);

  return { questionTypes, questionTypesLoaded };
}
