import { ToggleButtonGroup, Typography } from "@mui/material";
import { range } from "@survey-tool/core";
import { useMemo } from "react";
import { Star } from "@mui/icons-material";
import clsx from "clsx";

import { QuestionProps } from "../../types/survey-taking";
import styles from "../styles.module.css";
import { ColoredToggleButton } from "../../../core-components/colored-toggle-button";

import { assertSingleAnswer } from "./answer-assertions";
import { autoAdvanceIfDesired } from "./auto-advance-question";

const defaultMinimumRating = 1;
const defaultMaximumRating = 5;

function getAllowedRating(value: unknown, defaultValue: number): number {
  return typeof value === "number" ? value : defaultValue;
}

export function RatingQuestion({
  userSettings,
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

  function deriveStyle(value: number, maxValue: number) {
    const distanceFromMax = (maxValue - value) / maxValue;
    const hue = ((1 - distanceFromMax) * 120).toString(10);
    const color = `hsl(${hue},100%,50%)`;
    const backgroundColor = `hsl(${hue},100%,98%)`;
    return { color, backgroundColor };
  }
  const ratingRange = useMemo(() => {
    const ascendingRatings = range(minimumRating, maximumRating).map(
      (value) => ({
        ...deriveStyle(value, maximumRating),
        value,
        label: `${value}`,
      }),
    );
    return ascendingRatings.slice().reverse();
  }, [minimumRating, maximumRating]);

  assertSingleAnswer(question.id, activeAnswer);

  const handleAnswerChange = (value: string | string[]) => {
    const parsedAnswer = Array.isArray(value) ? value[0] : value;
    dispatch({
      type: "changeAnswer",
      questionId: question.id,
      answer: parsedAnswer,
    });
    autoAdvanceIfDesired(userSettings.autoAdvance, dispatch);
  };

  return (
    <div>
      <Typography variant="body1" className={styles.question}>
        {question.question}
      </Typography>
      <ToggleButtonGroup
        orientation="vertical"
        exclusive
        value={activeAnswer ?? ""}
        onChange={(_, value) => handleAnswerChange(value)}
        fullWidth
      >
        {ratingRange.map((option, index) => (
          <ColoredToggleButton
            backgroundColor={option.backgroundColor}
            key={`question-${question.id}-option-${index}`}
            value={option.label}
            className={styles.answerOption}
          >
            <span className={clsx(styles.centeredContent, styles.maximizeSize)}>
              {option.label}
            </span>
            <span className={clsx(styles.centeredContent, styles.minimizeSize)}>
              <Star style={{ color: option.color }} />
            </span>
          </ColoredToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
