import { useEffect, useState } from "react";
import { toCamel } from "convert-keys";

import { useUserId } from "../auth/use-user-id";
import { useSupabaseDb } from "../supabase/use-supabase-db";

import { DBUserValidation, UserValidation } from "./types";

function dbUserValidationToUserValidation(
  userId: string,
  dbUserValidation: DBUserValidation | null,
): UserValidation | null {
  return toCamel({ ...dbUserValidation, userId });
}

export function useUserValidationData() {
  const [userValidationLoaded, setUserValidationLoaded] = useState(false);
  const [userValidation, setUserValidation] = useState<UserValidation | null>(
    null,
  );
  const userId = useUserId();
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    setUserValidationLoaded(false);
    setUserValidation(null);
  }, [userId]);

  useEffect(() => {
    if (userValidationLoaded) return;
    if (!userId || !supabaseDb.clientLoaded) {
      setUserValidation(null);
    } else {
      supabaseDb.client
        .from("user_validation")
        .select(
          `
          user_id,
          submitted_timestamp,
          npi_number
        `,
        )
        .eq("user_id", userId)
        .maybeSingle<DBUserValidation>()
        .then((dbResult) => {
          const loadedProfile = dbUserValidationToUserValidation(
            userId,
            dbResult.data,
          );
          setUserValidation(loadedProfile);
          setUserValidationLoaded(true);
        });
    }
  }, [userId, supabaseDb, userValidationLoaded]);

  return { userValidationLoaded, userValidation };
}