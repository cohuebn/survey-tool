import { toCamel, toSnake } from "convert-keys";

import { asPostgresError } from "../../errors/postgres-error";
import { AppSupabaseClient } from "../../supabase/supabase-context";
import {
  AggregatedAnswersForQuestion,
  DBAnswer,
  DBAnswerWithoutParticipant,
  ParticipatingHospital,
} from "../types";

import { toParticipatingHospital } from "./participating-hospitals";

/**
 * Get all answers for the given survey for the given participant id
 * @param dbClient The Supabase client
 * @param surveyId The id of the survey
 * @param participantId The id of the participant
 */
export async function getParticipantAnswersForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
  participantId: string,
): Promise<DBAnswer[]> {
  const query = dbClient
    .from("answers")
    .select(
      `
      id,
      participant_id,
      survey_id,
      question_id,
      answer,
      answer_time
    `,
    )
    .eq("survey_id", surveyId)
    .eq("participant_id", participantId);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<DBAnswer>);
}

/**
 * Get all answers for the given survey
 * @param dbClient The Supabase client
 * @param surveyId The id of the survey
 */
export async function getAnswersForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<DBAnswerWithoutParticipant[]> {
  const query = dbClient
    .from("answers")
    .select(
      `
      id,
      participant_id,
      survey_id,
      question_id,
      answer,
      answer_time
    `,
    )
    .eq("survey_id", surveyId);
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<DBAnswerWithoutParticipant>);
}

/**
 * Get aggregated answer counts for the given survey
 * @param dbClient The Supabase client
 * @param surveyId The id of the survey
 */
export async function getAggregatedAnswersForSurvey(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<AggregatedAnswersForQuestion[]> {
  const query = dbClient.rpc("get_aggregate_answers", {
    survey_id_to_find: surveyId,
  });
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toCamel<AggregatedAnswersForQuestion>);
}

/** Delete the answers with the provided ids */
export async function deleteAnswers(
  dbClient: AppSupabaseClient,
  answerIds: string[],
) {
  const dbResult = await dbClient.from("answers").delete().in("id", answerIds);
  if (dbResult.error) throw asPostgresError(dbResult.error);
}

export async function insertAnswers(
  dbClient: AppSupabaseClient,
  answers: DBAnswer[],
) {
  const dbAnswers = answers.map(toSnake<DBAnswer>);
  const dbResult = await dbClient.from("answers").insert(dbAnswers);
  if (dbResult.error) throw asPostgresError(dbResult.error);
}

/**
 * Get all hospitals with at least one participant in the given survey
 * @param dbClient The Supabase client
 * @param surveyId The id of the survey to find participants for
 * @returns All participating hospitals including a count of participants in the given survey
 */
export async function getParticipatingHospitals(
  dbClient: AppSupabaseClient,
  surveyId: string,
): Promise<ParticipatingHospital[]> {
  const query = dbClient.rpc("get_participating_hospitals", {
    survey_id_to_find: surveyId,
  });
  const dbResult = await query;
  if (dbResult.error) throw asPostgresError(dbResult.error);
  return dbResult.data.map(toParticipatingHospital);
}
