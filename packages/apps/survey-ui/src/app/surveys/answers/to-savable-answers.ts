import { isNotNullOrUndefined } from "@survey-tool/core";

import {
  Answer,
  UserProvidedAnswersForQuestions,
  MultiAnswer,
  SavableAnswer,
  SingleAnswer,
} from "../types";
import { getParticipantId } from "../participant-ids";
import { PhysicianRole } from "../../users/types";

/**
 * Standardize answers (single or multi) into an array of answers
 * to allow for more consistent processing. This method takes care of filtering out
 * unselected answers (null or undefined)
 * A single answer will be converted into an array of one answer
 * A multi answer will be returned as is
 * @param answer The answer to convert
 * @returns An array of answers
 */
function toMultiAnswers(answer: Answer | null | undefined): MultiAnswer {
  const possibleAnswers = Array.isArray(answer) ? answer : [answer];
  return possibleAnswers.filter(isNotNullOrUndefined);
}

function toSavableAnswer(
  userId: string,
  surveyId: string,
  questionId: string,
  answer: SingleAnswer,
  role: PhysicianRole,
): SavableAnswer {
  const participantId = getParticipantId(userId, role.id, surveyId);
  return {
    participantId,
    surveyId,
    questionId,
    answer,
    answerTime: new Date(),
    location: role.hospital?.id,
    department: role.department,
    employmentType: role.employmentType,
  };
}

/** Get all answers with hashed PII to submit to the server */
export function toSavableAnswers(
  surveyId: string,
  answers: UserProvidedAnswersForQuestions,
  role: PhysicianRole,
): SavableAnswer[] {
  return Object.entries(answers).flatMap(([questionId, answer]) => {
    const multiAnswers = toMultiAnswers(answer);
    return multiAnswers.map((singleAnswer) =>
      toSavableAnswer(role.userId, surveyId, questionId, singleAnswer, role),
    );
  });
}
