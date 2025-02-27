import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { isNullOrUndefined } from "@survey-tool/core";

import {
  Question,
  MultipleChoiceQuestion as MultipleChoiceQuestionModel,
  MultiAnswer,
} from "../../types";
import { QuestionProps } from "../../types/survey-taking";
import styles from "../styles.module.css";

import { assertMultiAnswer, assertSingleAnswer } from "./answer-assertions";
import { autoAdvanceIfDesired } from "./auto-advance-question";

function assertMultipleChoiceQuestion(
  question: Question,
): asserts question is MultipleChoiceQuestionModel {
  if (isNullOrUndefined(question.definition.options)) {
    throw new Error("Not a multiple choice question");
  }
}

type MultipleChoiceQuestionProps = Omit<QuestionProps, "question"> & {
  question: MultipleChoiceQuestionModel;
};

function SingleAllowedAnswers({
  userSettings,
  question,
  activeAnswer,
  dispatch,
}: MultipleChoiceQuestionProps) {
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
    <ToggleButtonGroup
      color="primary"
      orientation="vertical"
      exclusive
      value={activeAnswer ?? ""}
      onChange={(_, value) => handleAnswerChange(value)}
      fullWidth
    >
      {question.definition.options.map((option, index) => (
        <ToggleButton
          key={`question-${question.id}-option-${index}`}
          value={option.value}
          className={styles.answerOption}
        >
          {option.value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function MultipleAllowedAnswers({
  question,
  activeAnswer,
  dispatch,
}: MultipleChoiceQuestionProps) {
  assertMultiAnswer(question.id, activeAnswer);

  const handleAnswerChange = (answer: MultiAnswer) => {
    dispatch({
      type: "changeAnswer",
      questionId: question.id,
      answer,
    });
  };

  return (
    <ToggleButtonGroup
      color="primary"
      orientation="vertical"
      value={activeAnswer ?? ""}
      onChange={(_, value) => handleAnswerChange(value)}
      fullWidth
    >
      {question.definition.options.map((option, index) => (
        <ToggleButton
          key={`question-${question.id}-option-${index}`}
          value={option.value}
          className={styles.answerOption}
        >
          {option.value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export function MultipleChoiceQuestion({
  userId,
  userSettings,
  question,
  dispatch,
  activeAnswer,
}: QuestionProps) {
  assertMultipleChoiceQuestion(question);
  const { multipleChoiceType } = question.definition;

  return (
    <div>
      <Typography variant="body1" className={styles.question}>
        {question.question}
      </Typography>
      {multipleChoiceType === "multipleAnswers" ? (
        <MultipleAllowedAnswers
          userId={userId}
          userSettings={userSettings}
          question={question}
          dispatch={dispatch}
          activeAnswer={activeAnswer}
        />
      ) : (
        <SingleAllowedAnswers
          userId={userId}
          userSettings={userSettings}
          question={question}
          dispatch={dispatch}
          activeAnswer={activeAnswer}
        />
      )}
    </div>
  );
}
