import { toDate } from "@survey-tool/date-utils";
import { isNullOrUndefined } from "@survey-tool/core";

import { asPostgresError } from "../errors/postgres-error";
import { AppSupabaseClient } from "../supabase/types";
import { getHospitalFromDatabaseResult } from "../hospitals/transformations";

import { DBPhysicianRole, PhysicianRole } from "./types";

function toPhysicianRole(dbResult: DBPhysicianRole): PhysicianRole {
  return {
    userId: dbResult.user_id,
    hospital: getHospitalFromDatabaseResult(dbResult),
    department: dbResult.department,
    employmentType: dbResult.employment_type,
    createdTimestamp: toDate(dbResult.created_timestamp),
    validatedTimestamp: toDate(dbResult.validated_timestamp),
  };
}

export async function getPhysicianRolesForUser(
  dbClient: AppSupabaseClient,
  userId: string | undefined,
): Promise<PhysicianRole[]> {
  if (isNullOrUndefined(userId)) return [];

  const dbResult = await dbClient
    .rpc("get_physician_roles_for_user", { user_id_to_find: userId })
    .select(
      `
      user_id,
      location,
      hospital_name,
      hospital_city,
      hospital_state,
      department,
      employment_type,
      created_timestamp,
      validated_timestamp
    `,
    );
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toPhysicianRole);
}
