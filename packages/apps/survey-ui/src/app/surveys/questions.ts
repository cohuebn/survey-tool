import { toCamel } from "convert-keys";
import { v4 as uuidV4 } from "uuid";

import { AppSupabaseClient } from "../supabase/supabase-context";
import { asPostgresError } from "../errors/postgres-error";

import { EditableQuestion, Question } from "./types";

export async function getQuestionsForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<Question[]> {
  const query = dbClient
    .from("survey_questions")
    .select(
      `
      id,
      survey_id,
      question_type:survey_question_types(id, question_type),
      question,
      definition
    `,
    )
    .eq("survey_id", surveyId);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<Question>);
}

export function createNewEditableQuestion(surveyId: string): EditableQuestion {
  return {
    id: uuidV4(),
    surveyId,
  };
}
