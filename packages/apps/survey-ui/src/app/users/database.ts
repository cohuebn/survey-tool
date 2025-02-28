import { toDate } from "@survey-tool/date-utils";
import { isNullOrUndefined } from "@survey-tool/core";

import { asPostgresError } from "../errors/postgres-error";
import { AppSupabaseClient } from "../supabase/types";
import { getHospitalFromDatabaseResult } from "../hospitals/transformations";

import {
  DBPhysicianRole,
  PhysicianRole,
  SavableDBPhysicianRole,
} from "./types";

function toPhysicianRole(dbResult: DBPhysicianRole): PhysicianRole {
  return {
    id: dbResult.id,
    userId: dbResult.user_id,
    hospital: getHospitalFromDatabaseResult(dbResult),
    department: dbResult.department,
    employmentType: dbResult.employment_type,
    createdTimestamp: toDate(dbResult.created_timestamp),
    validatedTimestamp: isNullOrUndefined(dbResult.validated_timestamp)
      ? undefined
      : toDate(dbResult.validated_timestamp),
  };
}

function toSavableDbPhysicianRole(role: PhysicianRole): SavableDBPhysicianRole {
  return {
    id: role.id,
    user_id: role.userId,
    location: role.hospital!.id,
    department: role.department!,
    employment_type: role.employmentType!,
    created_timestamp: role.createdTimestamp,
    validated_timestamp: role.validatedTimestamp,
  };
}

export async function getPhysicianRolesForUser(
  dbClient: AppSupabaseClient,
  userId: string | undefined,
  roleId?: string,
): Promise<PhysicianRole[]> {
  if (isNullOrUndefined(userId)) return [];

  const dbResult = await dbClient
    .rpc("get_physician_roles_for_user", {
      user_id_to_find: userId,
      id_to_find: roleId,
    })
    .select(
      `
      id,
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

export async function savePhysicianRoles(
  dbClient: AppSupabaseClient,
  roles: PhysicianRole[],
) {
  if (!roles.length) {
    throw new Error("Expected at least one role, but none provided");
  }
  const dbPhysicianRoles = roles.map(toSavableDbPhysicianRole);
  const upsertRoles = dbClient.from("physician_roles").upsert(dbPhysicianRoles);
  const deleteRoles = dbClient
    .from("physician_roles")
    .delete()
    .eq("user_id", roles[0].userId)
    .not("id", "in", `(${roles.map((role) => role.id)})`);

  const [upsertResult, deleteResult] = await Promise.all([
    upsertRoles,
    deleteRoles,
  ]);
  const error = upsertResult.error || deleteResult.error;
  if (error) throw asPostgresError(error);
}
