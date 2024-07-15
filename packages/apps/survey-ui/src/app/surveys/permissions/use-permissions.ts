"use client";

import { useEffect, useState } from "react";

import { useSupabaseDb } from "../../supabase/use-supabase-db";

import { getPermissionsForSurvey } from "./database";
import { SurveyPermissions } from "../types";

export function useSurveyPermissions(surveyId: string) {
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [permissions, setPermissions] = useState<SurveyPermissions | null>(
    null,
  );
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (permissionsLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    getPermissionsForSurvey(supabaseDb.client, surveyId).then(
      (loadedPermissions) => {
        setPermissions(loadedPermissions);
        setPermissionsLoaded(true);
      },
    );
  }, [supabaseDb, surveyId, permissionsLoaded]);

  return { permissions, permissionsLoaded };
}
