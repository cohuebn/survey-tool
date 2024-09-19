import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import { QuestionProps } from "../../types/survey-taking";
import styles from "../styles.module.css";

import { assertSingleAnswer } from "./answer-assertions";

export function YesNoQuestion({
  question,
  activeAnswer,
  dispatch,
}: QuestionProps) {
  assertSingleAnswer(question.id, activeAnswer);

  const options = ["No", "Yes"];

  const handleAnswerChange = (value: string | string[]) => {
    const parsedAnswer = Array.isArray(value) ? value[0] : value;
    dispatch({
      type: "changeAnswer",
      questionId: question.id,
      answer: parsedAnswer,
    });
  };

  return (
    <div>
      <Typography variant="body1" className={styles.question}>
        {question.question}
      </Typography>
      <ToggleButtonGroup
        color="primary"
        orientation="vertical"
        exclusive
        value={activeAnswer ?? ""}
        onChange={(_, value) => handleAnswerChange(value)}
        fullWidth
      >
        {options.map((option, index) => (
          <ToggleButton
            key={`question-${question.id}-option-${index}`}
            value={option}
            className={styles.answerOption}
          >
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
