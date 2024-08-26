import { Slider, Typography } from "@mui/material";
import { range } from "@survey-tool/core";
import { useMemo } from "react";

import { QuestionProps } from "./types";

const defaultMinimumRating = 1;
const defaultMaximumRating = 5;

function getAllowedRating(value: unknown, defaultValue: number): number {
  return typeof value === "number" ? value : defaultValue;
}

export function RatingQuestion({ question }: QuestionProps) {
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
  return (
    <div>
      <Typography variant="body1">{question.question}</Typography>
      <Slider
        min={minimumRating}
        max={maximumRating}
        step={1}
        marks={ratingRange}
      />
    </div>
  );
}
