import { toCamel } from "convert-keys";

import { AppSupabaseClient } from "../../supabase/supabase-context";
import { asPostgresError } from "../../errors/postgres-error";
import { DBQuestion, Question, QuestionType } from "../types";

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
      definition,
      sort_order
    `,
    )
    .eq("survey_id", surveyId)
    .order("sort_order");
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<Question>);
}

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

export function toDbQuestion(question: Question): DBQuestion {
  return {
    id: question.id,
    survey_id: question.surveyId,
    question_type_id: question.questionType.id,
    question: question.question,
    sort_order: question.sortOrder,
    definition: question.definition,
  };
}

export async function saveQuestions(
  dbClient: AppSupabaseClient,
  questions: Question[],
) {
  const dbQuestions = questions.map(toDbQuestion);
  const dbResult = await dbClient.from("survey_questions").upsert(dbQuestions);
  if (dbResult.error) throw asPostgresError(dbResult.error);
}

export async function deleteQuestions(
  dbClient: AppSupabaseClient,
  questionIds: string[],
) {
  const dbResult = await dbClient
    .from("survey_questions")
    .delete()
    .in("id", questionIds);
  if (dbResult.error) throw asPostgresError(dbResult.error);
}
