import { Slider, Typography } from "@mui/material";
import { isNullOrUndefined, range } from "@survey-tool/core";
import { useMemo } from "react";

import { QuestionProps } from "../../types/survey-taking";

import { assertSingleAnswer } from "./answer-assertions";

const defaultMinimumRating = 1;
const defaultMaximumRating = 5;

function getAllowedRating(value: unknown, defaultValue: number): number {
  return typeof value === "number" ? value : defaultValue;
}

export function RatingQuestion({
  question,
  activeAnswer,
  dispatch,
}: QuestionProps) {
  assertSingleAnswer(question.id, activeAnswer);
  const minimumRating = getAllowedRating(
    question.definition.minRating,
    defaultMinimumRating,
  );
  const maximumRating = getAllowedRating(
    question.definition.maxRating,
    defaultMaximumRating,
  );
  const ratingRange = useMemo(
    () =>
      range(minimumRating, maximumRating).map((value) => ({
        value,
        label: `${value}`,
      })),
    [minimumRating, maximumRating],
  );
  const numericAnswer = useMemo(() => {
    if (isNullOrUndefined(activeAnswer)) return minimumRating;
    if (typeof activeAnswer === "string") return parseInt(activeAnswer, 10);
    return activeAnswer;
  }, [activeAnswer, minimumRating]);

  const handleAnswerChange = (_: unknown, value: number | number[]) => {
    if (Array.isArray(value))
      throw new Error(`Did not expect an array of numbers`);
    dispatch({
      type: "changeAnswer",
      questionId: question.id,
      answer: `${value}`,
    });
  };

  return (
    <div>
      <Typography variant="body1">{question.question}</Typography>
      <Slider
        min={minimumRating}
        max={maximumRating}
        step={1}
        marks={ratingRange}
        value={numericAnswer}
        onChange={handleAnswerChange}
      />
    </div>
  );
}
