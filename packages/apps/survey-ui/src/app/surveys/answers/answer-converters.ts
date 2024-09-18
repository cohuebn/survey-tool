import groupBy from "just-group-by";

import { AnswersForQuestions, DBAnswer } from "../types";

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
