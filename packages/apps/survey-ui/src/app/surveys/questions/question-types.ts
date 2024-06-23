import { toCamel } from "convert-keys";

import { AppSupabaseClient } from "../../supabase/supabase-context";
import { asPostgresError } from "../../errors/postgres-error";
import { QuestionType } from "../types";

export async function getQuestionTypes(
  dbClient: AppSupabaseClient,
): Promise<QuestionType[]> {
  const query = dbClient.from("survey_question_types").select(
    `
      id,
      question_type
    `,
  );
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<QuestionType>);
}
