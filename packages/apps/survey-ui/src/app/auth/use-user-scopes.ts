import { useEffect, useState } from "react";

import { useSupabaseDb } from "../supabase/use-supabase-db";

import { useUserId } from "./use-user-id";

export function useUserScopes() {
  const [userScopesLoaded, setUserScopesLoaded] = useState(false);
  const [userScopes, setUserScopes] = useState<string[] | null>(null);
  const userId = useUserId();
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    setUserScopesLoaded(false);
    setUserScopes(null);
  }, [userId]);

  useEffect(() => {
    if (userScopesLoaded) return;
    if (!userId || !supabaseDb.clientLoaded) {
      setUserScopes(null);
    } else {
      supabaseDb.client
        .schema("app_iam")
        .from("scopes")
        .select("scope")
        .eq("user_id", userId)
        .then((dbResult) => {
          const loadedScopes = dbResult.data?.map((x) => x.scope) ?? [];
          setUserScopes(loadedScopes);
          setUserScopesLoaded(true);
        });
    }
  }, [userId, supabaseDb, userScopesLoaded]);

  return {
    userScopes,
    userScopesLoaded,
    userHasScope: (scope: string) => userScopes?.includes(scope) ?? false,
  };
}
