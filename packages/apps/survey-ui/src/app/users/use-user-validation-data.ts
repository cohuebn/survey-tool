import { useEffect, useState } from "react";
import { toCamel } from "convert-keys";

import { useSupabaseDb } from "../supabase/use-supabase-db";

import { DBUserValidation, UserValidation } from "./types";

function dbUserValidationToUserValidation(
  userId: string,
  dbUserValidation: DBUserValidation | null,
): UserValidation | null {
  if (!dbUserValidation) return null;
  return toCamel({ ...dbUserValidation, userId });
}

export function useUserValidationData(userId: string | undefined) {
  const [userValidationLoaded, setUserValidationLoaded] = useState(false);
  const [userValidation, setUserValidation] = useState<UserValidation | null>(
    null,
  );
  // const userId = useUserId();
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
          denied_timestamp,
          denied_reason,
          email_address,
          npi_number
        `,
        )
        .eq("user_id", userId)
        .maybeSingle<DBUserValidation>()
        .then((dbResult) => {
          const loadedUserValidation = dbUserValidationToUserValidation(
            userId,
            dbResult.data,
          );
          setUserValidation(loadedUserValidation);
          setUserValidationLoaded(true);
        });
    }
  }, [userId, supabaseDb, userValidationLoaded]);

  return { userValidationLoaded, userValidation };
}
