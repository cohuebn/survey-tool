import { toCamel } from "convert-keys";

import { asPostgresError } from "../../errors/postgres-error";
import { AppSupabaseClient } from "../../supabase/supabase-context";
import { DBSurveyPermissions, SurveyPermissions } from "../types";

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
