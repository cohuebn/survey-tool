import { createLogger, isNotNullOrUndefined } from "@survey-tool/core";

import { getOptions } from "../questions/definitions";
import { Question, SavableAnswer } from "../types";
import { mean } from "../../utils/averages";

const logger = createLogger("to-overall-rating");

function getRatingNumericValue(answer: SavableAnswer): number {
  return parseInt(answer.answer, 10);
}

function getMultipleChoiceAnswerNumericValue(
  question: Question,
  answer: SavableAnswer,
): number {
  const matchingOption = getOptions(question.definition).find(
    (option) => option.value === answer.answer,
  );
  if (!matchingOption) {
    throw new Error(
      `No option found on question ${question.id} matching '${answer}'`,
    );
  }

  return matchingOption.numericValue;
}

function getNumericAnswerValue(
  question: Question,
  answer: SavableAnswer,
): number | undefined {
  if (!question.definition.includeInOverallRating) {
    return undefined;
  }

  const { questionType } = question.questionType;
  if (questionType === "Rating") {
    return getRatingNumericValue(answer);
  }

  if (questionType === "Multiple choice") {
    return getMultipleChoiceAnswerNumericValue(question, answer);
  }

  // If we get this far, the strategy for numeric value assignment is unknown
  logger.warn(
    {
      questionId: question.id,
      questionType: question.questionType.questionType,
      answer: answer.answer,
    },
    "Attempted to get numeric value, but can't for this question",
  );
  return undefined;
}

/**
 * Get the overall rating numeric value given the provided survey questions & answers
 * @param questions The questions for the survey
 * @param answers The user's answers for the survey
 * @returns An overall rating if any answers should be included in the overall rating;
 * if no answers should be included in the overall rating, return undefined
 */
export function toOverallRatingValue(
  questions: Question[],
  answers: SavableAnswer[],
): number | undefined {
  const questionsById = questions.reduce<Record<string, Question>>(
    (_questionsById, question) => {
      return { ..._questionsById, [question.id]: question };
    },
    {},
  );
  const numericAnswerValues = answers
    .map((answer) => {
      const question = questionsById[answer.questionId];
      return getNumericAnswerValue(question, answer);
    })
    .filter(isNotNullOrUndefined);

  return numericAnswerValues.length ? mean(numericAnswerValues) : undefined;
}
