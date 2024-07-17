import { toCamel, toSnake } from "convert-keys";

import { asPostgresError } from "../../errors/postgres-error";
import { AppSupabaseClient } from "../../supabase/supabase-context";
import {
  DBSurveyPermissions,
  SurveyAllowedLocation,
  SurveyPermissions,
} from "../types";

export async function getPermissionsForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<SurveyPermissions | null> {
  const query = dbClient
    .from("survey_permissions")
    .select(
      `
      id,
      survey_id,
      is_public,
      restrict_by_location,
      restrict_by_department
    `,
    )
    .eq("survey_id", surveyId)
    .maybeSingle<DBSurveyPermissions>();
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data ? toCamel<SurveyPermissions>(dbResult.data) : null;
}

function toDbPermission(permissions: SurveyPermissions): DBSurveyPermissions {
  return toSnake<DBSurveyPermissions>(permissions);
}

export async function savePermissionsForSurvey(
  dbClient: AppSupabaseClient,
  permissions: SurveyPermissions,
) {
  const dbPermissions = toDbPermission(permissions);
  const dbResult = await dbClient
    .from("survey_permissions")
    .upsert(dbPermissions);
  if (dbResult.error) throw asPostgresError(dbResult.error);
}

export async function getLocationRestrictionsForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<SurveyAllowedLocation[]> {
  const query = dbClient
    .from("survey_location_restrictions")
    .select(
      `
      id,
      survey_id,
      location_id,
      location:hospitals(id, name, city, state)
    `,
    )
    .eq("survey_id", surveyId);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<SurveyAllowedLocation>);
}
