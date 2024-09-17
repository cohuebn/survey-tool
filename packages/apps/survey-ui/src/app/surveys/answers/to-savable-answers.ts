"use server";

import { v4 as uuid } from "uuid";
import { toHashedKey } from "@survey-tool/core";

import {
  Answer,
  DBAnswer,
  MultiAnswer,
  SavableAnswer,
  SingleAnswer,
} from "../types";
import { getParticipantId } from "../participant-ids";

/**
 * Standardize answers (single or multi) into an array of answers
 * to allow for more consistent processing.
 * A single answer will be converted into an array of one answer
 * A multi answer will be returned as is
 * @param answer The answer to convert
 * @returns An array of answers
 */
function toMultiAnswers(answer: Answer): MultiAnswer {
  return Array.isArray(answer) ? answer : [answer];
}

function toSavableAnswer(
  userId: string,
  surveyId: string,
  questionId: string,
  answer: SingleAnswer,
): SavableAnswer {
  const participantId = getParticipantId(userId, surveyId);
  return {
    participantId,
    surveyId,
    questionId,
    answer,
    answerTime: new Date(),
  };
}

// TODO - figure out if this needs to be async; doing it for now while
// "use server" yells about non-async functions
/** Get all answers with hashed PII to submit to the server */
export async function toSavableAnswers(
  userId: string,
  surveyId: string,
  answers: Record<string, Answer>,
): Promise<SavableAnswer[]> {
  return Object.entries(answers).flatMap(([questionId, answer]) => {
    const multiAnswers = toMultiAnswers(answer);
    return multiAnswers.map((singleAnswer) =>
      toSavableAnswer(userId, surveyId, questionId, singleAnswer),
    );
  });
}
