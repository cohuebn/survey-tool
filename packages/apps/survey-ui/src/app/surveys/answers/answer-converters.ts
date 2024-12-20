import groupBy from "just-group-by";

import {
  AggregatedAnswerForQuestion,
  AggregatedAnswerWithLocationForQuestion,
  AggregatedAnswersForQuestions,
  AggregatedAnswersWithLocationForQuestions,
  AnswersForQuestions,
  DBAnswer,
} from "../types";

/**
 * Convert DB answers (1 row per answer string)
 * into answers for the application (1 row per question with 1 or more answers).
 * @param dbAnswers The full answer objects from the database
 * @returns A record mapping question IDs to answers. If a question has multiple answers, they are returned as an array.
 * If a question has only one answer, it is returned as a string.
 */
export function dbAnswersToAnswers(dbAnswers: DBAnswer[]): AnswersForQuestions {
  const dbAnswersByQuestion = groupBy(dbAnswers, (x) => x.questionId);
  return Object.entries(dbAnswersByQuestion).reduce<AnswersForQuestions>(
    (questionsAndAnswers, [questionId, dbAnswersForQuestion]) => {
      const answers = dbAnswersForQuestion.map((x) => x.answer);
      return {
        ...questionsAndAnswers,
        [questionId]: answers.length === 1 ? answers[0] : answers,
      };
    },
    {},
  );
}

/**
 * Convert DB answers (1 row per answer string)
 * into answers for the application (1 row per question with 1 or more aggregated answers beneath it).
 * Note this function combines answers from multiple locations by adding counts together.
 * @param dbAnswers The full answer objects from the database
 * @returns A record mapping question IDs to aggregated answers. Answers will be returned as an array of objects
 */
export function dbAggregatedAnswersToAnswers(
  dbAnswers: AggregatedAnswerWithLocationForQuestion[],
): AggregatedAnswersWithLocationForQuestions {
  return groupBy(dbAnswers, (x) => x.questionId);
}

function getAnswerKey(answer: AggregatedAnswerWithLocationForQuestion): string {
  return `${answer.questionId}-${answer.answer}`;
}

/**
 * Combine a answers include location into location-agnostic answers by adding
 * counts together for the same answer. This also convertes an array of answers
 * into answers for the application (1 entry per question with 1 or more aggregated answers beneath it).
 */
export function combineAnswersFromMultipleLocations(
  answersWithLocation: AggregatedAnswerWithLocationForQuestion[],
): AggregatedAnswersForQuestions {
  const aggregatedAnswerMap = answersWithLocation.reduce<
    Record<string, AggregatedAnswerForQuestion>
  >((aggregateAnswers, answer) => {
    const answerKey = getAnswerKey(answer);
    const existingAnswer = aggregateAnswers[answerKey];
    const existingAnswerCount = existingAnswer?.answerCount || 0;
    const updatedAnswer = {
      questionId: answer.questionId,
      answer: answer.answer,
      answerCount: existingAnswerCount + answer.answerCount,
    };
    return { ...aggregateAnswers, [answerKey]: updatedAnswer };
  }, {});

  return groupBy(
    Object.values(aggregatedAnswerMap).flat(),
    (x) => x.questionId,
  );
}
