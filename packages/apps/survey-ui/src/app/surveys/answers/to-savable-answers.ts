import {
  Answer,
  AnswersForQuestions,
  MultiAnswer,
  SavableAnswer,
  SingleAnswer,
} from "../types";
import { getParticipantId } from "../participant-ids";
import { UserProfile } from "../../users/types";

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
  userProfile: UserProfile,
): SavableAnswer {
  const participantId = getParticipantId(userId, surveyId);
  return {
    participantId,
    surveyId,
    questionId,
    answer,
    answerTime: new Date(),
    location: userProfile.location,
    department: userProfile.department,
    employmentType: userProfile.employmentType,
  };
}

/** Get all answers with hashed PII to submit to the server */
export function toSavableAnswers(
  surveyId: string,
  answers: AnswersForQuestions,
  userProfile: UserProfile,
): SavableAnswer[] {
  return Object.entries(answers).flatMap(([questionId, answer]) => {
    const multiAnswers = toMultiAnswers(answer);
    return multiAnswers.map((singleAnswer) =>
      toSavableAnswer(
        userProfile.userId,
        surveyId,
        questionId,
        singleAnswer,
        userProfile,
      ),
    );
  });
}
