import { v4 as uuid } from "uuid";

import { AppSupabaseClient } from "../../supabase/supabase-context";
import { DBAnswer, SavableAnswer } from "../types";

import {
  deleteAnswers,
  getParticipantAnswersForSurvey,
  insertAnswers,
} from "./database";

function answerExists(
  existingAnswers: SavableAnswer[],
  answer: SavableAnswer,
): boolean {
  return existingAnswers.some(
    (existingAnswer) =>
      existingAnswer.questionId === answer.questionId &&
      existingAnswer.answer === answer.answer,
  );
}

function toDbAnswer(answer: SavableAnswer): DBAnswer {
  return { id: uuid(), ...answer };
}

/**
 * Update a participant's answers to the given survey
 * @param dbClient The Supabase client
 * @param participantId The id of the participant taking the survey
 * @param surveyId The id of the survey
 * @param savableAnswers The answers to merge
 */
export async function updateParticipantAnswers(
  dbClient: AppSupabaseClient,
  participantId: string,
  surveyId: string,
  savableAnswers: SavableAnswer[],
) {
  const existingAnswers = await getParticipantAnswersForSurvey(
    dbClient,
    surveyId,
    participantId,
  );
  const answersToDelete = existingAnswers
    .filter((answer) => !answerExists(savableAnswers, answer))
    .map((answer) => answer.id);
  const newAnswers = savableAnswers
    .filter((answer) => !answerExists(existingAnswers, answer))
    .map(toDbAnswer);

  await Promise.all([
    deleteAnswers(dbClient, answersToDelete),
    insertAnswers(dbClient, newAnswers),
  ]);
}
