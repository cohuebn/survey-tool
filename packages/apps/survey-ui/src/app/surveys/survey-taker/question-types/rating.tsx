import { ToggleButtonGroup, Typography } from "@mui/material";
import { range } from "@survey-tool/core";
import { useCallback, useMemo } from "react";
import { StarBorderOutlined } from "@mui/icons-material";
import clsx from "clsx";

import { QuestionProps } from "../../types/survey-taking";
import styles from "../styles.module.css";
import { ColoredToggleButton } from "../../../core-components/colored-toggle-button";
import {
  asRgbaCssString,
  getSimpleGradient,
} from "../../../utils/color-generator";

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

  const deriveStyle = useCallback(
    (rating: number) => {
      const steps = maximumRating - minimumRating;
      const colors = getSimpleGradient(steps + 1);
      const rgbaParts = colors[rating - minimumRating];
      return {
        color: asRgbaCssString(rgbaParts),
        backgroundColor: asRgbaCssString({ ...rgbaParts, alpha: 0.9 }),
      };
    },
    [minimumRating, maximumRating],
  );

  const ratingRange = useMemo(() => {
    const ascendingRatings = range(minimumRating, maximumRating).map(
      (value) => ({
        ...deriveStyle(value),
        value,
        label: `${value}`,
      }),
    );
    return ascendingRatings.slice().reverse();
  }, [deriveStyle, maximumRating, minimumRating]);

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
            textColor={option.color}
            key={`question-${question.id}-option-${index}`}
            value={option.label}
            className={styles.answerOption}
          >
            <span className={clsx(styles.centeredContent, styles.maximizeSize)}>
              {option.label}
            </span>
            <span className={clsx(styles.centeredContent, styles.minimizeSize)}>
              <StarBorderOutlined className="icon" />
            </span>
          </ColoredToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
