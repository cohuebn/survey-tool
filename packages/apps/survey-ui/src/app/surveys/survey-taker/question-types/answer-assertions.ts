import { isNotNullOrUndefined } from "@survey-tool/core";

import { Answer, MultiAnswer, SingleAnswer } from "../../types";

export function assertSingleAnswer(
  questionId: string,
  answer: Answer | null,
): asserts answer is SingleAnswer | null {
  if (isNotNullOrUndefined(answer) && typeof answer !== "string") {
    throw new Error(
      `Expected answer to question ${questionId} to be a single answer, but received ${answer}`,
    );
  }
}

export function assertMultiAnswer(
  questionId: string,
  answer: Answer | null,
): asserts answer is MultiAnswer | null {
  if (isNotNullOrUndefined(answer) && !Array.isArray(answer)) {
    throw new Error(
      `Expected answer to question ${questionId} to be a multi answer, but received ${answer}`,
    );
  }
}
