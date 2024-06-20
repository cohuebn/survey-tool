"use client";

import { useEffect, useState } from "react";
import { toCamel } from "convert-keys";

import { useSupabaseDb } from "../supabase/use-supabase-db";
import { useUserScopes } from "../auth/use-user-scopes";

import { UserWithValidationData } from "./types";

export function useUnvalidatedUsers() {
  const [unvalidatedUsersLoaded, setUnvalidatedUsersLoaded] = useState(false);
  const [unvalidatedUsers, setUnvalidatedUsers] = useState<
    UserWithValidationData[] | null
  >(null);
  const { userScopesLoaded, userHasScope } = useUserScopes();
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (unvalidatedUsersLoaded) return;
    if (!userScopesLoaded || !supabaseDb.clientLoaded) {
      setUnvalidatedUsers(null);
      return;
    }
    if (!userHasScope("admin")) {
      throw new Error("User does not have admin scope. Cannot load user data");
    } else {
      supabaseDb.client
        .from("users")
        .select(
          `
          user_id,
          validated_timestamp,
          location,
          hospitals(id, name, city, state),
          department,
          employment_type,
          user_validation!inner(npi_number, email_address, submitted_timestamp)
        `,
        )
        .is("validated_timestamp", null)
        .is("user_validation.denied_timestamp", null)
        .then((dbResult) => {
          const loadedUsers =
            dbResult.data?.map((x) => toCamel<UserWithValidationData>(x)) ?? [];
          setUnvalidatedUsers(loadedUsers);
          setUnvalidatedUsersLoaded(true);
        });
    }
  }, [supabaseDb, unvalidatedUsersLoaded, userScopesLoaded, userHasScope]);

  return {
    unvalidatedUsers: unvalidatedUsers ?? [],
    unvalidatedUsersLoaded,
  };
}
