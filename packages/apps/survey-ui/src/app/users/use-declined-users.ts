import { useEffect, useState } from "react";

import { useUserScopes } from "../auth/use-user-scopes";
import { useSupabaseDb } from "../supabase/use-supabase-db";
import { adminScope } from "../auth/scopes";
import { getHospitalFromDatabaseResult } from "../hospitals/transformations";

import { DBDeniedUser, UserWithValidationData } from "./types";

function toUserWithValidationData(
  dbUser: DBDeniedUser,
): UserWithValidationData {
  return {
    userId: dbUser.user_id,
    validatedTimestamp: undefined,
    hospital: getHospitalFromDatabaseResult(dbUser),
    department: dbUser.department,
    employmentType: dbUser.employment_type,
    userValidation: {
      userId: dbUser.user_id,
      emailAddress: dbUser.email_address,
      npiNumber: dbUser.npi_number,
      submittedTimestamp: dbUser.submitted_timestamp,
      deniedTimestamp: dbUser.denied_timestamp,
      deniedReason: dbUser.denied_reason,
    },
  };
}

export function useDeclinedUsers() {
  const [declinedUsersLoaded, setDeclinedUsersLoaded] = useState(false);
  const [declinedUsers, setDeclinedUsers] = useState<
    UserWithValidationData[] | null
  >(null);
  const { userScopesLoaded, userHasScope } = useUserScopes();
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    if (declinedUsersLoaded) return;
    if (!userScopesLoaded || !supabaseDb.clientLoaded) {
      setDeclinedUsers(null);
      return;
    }
    if (!userHasScope(adminScope)) {
      throw new Error("User does not have admin scope. Cannot load user data");
    } else {
      supabaseDb.client
        .from("denied_users")
        .select(
          `
          user_id,
          submitted_timestamp,
          npi_number,
          email_address,
          denied_timestamp,
          denied_reason,
          hospital_location,
          hospital_name,
          hospital_city,
          hospital_state,
          department,
          employment_type
        `,
        )
        .then((dbResult) => {
          const loadedUsers =
            dbResult.data?.map(toUserWithValidationData) ?? [];
          setDeclinedUsers(loadedUsers);
          setDeclinedUsersLoaded(true);
        });
    }
  }, [supabaseDb, declinedUsersLoaded, userScopesLoaded, userHasScope]);

  return {
    declinedUsers: declinedUsers ?? [],
    declinedUsersLoaded,
  };
}
