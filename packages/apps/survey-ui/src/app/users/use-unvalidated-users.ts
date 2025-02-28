"use client";

import { useEffect, useState } from "react";
import { toDate } from "@survey-tool/date-utils";

import { useSupabaseDb } from "../supabase/use-supabase-db";
import { useUserScopes } from "../auth/use-user-scopes";
import { asPostgresError } from "../errors/postgres-error";
import { adminScope } from "../auth/scopes";
import { getHospitalFromDatabaseResult } from "../hospitals/transformations";

import { UserWithValidationData } from "./types";

type DBUnvalidatedUser = {
  user_id: string;
  validated_timestamp?: string;
  submitted_timestamp: string;
  npi_number?: string;
  email_address: string;
  hospital_location: string;
  hospital_name: string;
  hospital_city: string;
  hospital_state: string;
  department: string;
  employment_type: string;
};

function toUserWithValidationData(
  dbUser: DBUnvalidatedUser,
): UserWithValidationData {
  return {
    userId: dbUser.user_id,
    validatedTimestamp: dbUser.validated_timestamp
      ? toDate(dbUser.validated_timestamp)
      : undefined,
    hospital: getHospitalFromDatabaseResult(dbUser),
    department: dbUser.department,
    employmentType: dbUser.employment_type,
    userValidation: {
      userId: dbUser.user_id,
      emailAddress: dbUser.email_address,
      npiNumber: dbUser.npi_number,
      submittedTimestamp: toDate(dbUser.submitted_timestamp),
    },
  };
}

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
    if (!userHasScope(adminScope)) {
      throw new Error("User does not have admin scope. Cannot load user data");
    } else {
      supabaseDb.client
        .from("users_needing_validation")
        .select(
          `
          user_id,
          validated_timestamp,
          submitted_timestamp,
          npi_number,
          email_address,
          hospital_location,
          hospital_name,
          hospital_city,
          hospital_state,
          department,
          employment_type
        `,
        )
        .then((dbResult) => {
          if (dbResult.error) {
            throw asPostgresError(dbResult.error);
          }
          const loadedUsers = dbResult.data.map(toUserWithValidationData) ?? [];
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
