"use server";

import { toHashedKey } from "@survey-tool/core";

import { Answer, SavableAnswer } from "../types";

// TODO - figure out if this needs to be async; doing it for now while
// "use server" yells about non-async functions
/** Get all answers with hashed PII to submit to the server */
export async function getSavableAnswers(
  userId: string,
  surveyId: string,
  answers: Record<string, Answer>,
): Promise<SavableAnswer[]> {
  return Object.entries(answers).flatMap(([questionId, answer]) => {
    const multiAnswers = Array.isArray(answer) ? answer : [answer];
    return multiAnswers.map((singleAnswer) => {
      const participantId = toHashedKey([userId, surveyId, questionId]);
      return {
        participantId,
        surveyId,
        questionId,
        answer: singleAnswer,
      };
    });
  });
}
