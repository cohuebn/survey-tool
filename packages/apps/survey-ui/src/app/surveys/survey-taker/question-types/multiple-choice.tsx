import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { isNullOrUndefined } from "@survey-tool/core";
import { ChangeEvent } from "react";

import {
  Question,
  MultipleChoiceQuestion as MultipleChoiceQuestionModel,
} from "../../types";

import { QuestionProps } from "./types";

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
  question,
  activeAnswer,
  dispatch,
}: MultipleChoiceQuestionProps) {
  const handleAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "changeAnswer",
      questionId: question.id,
      answer: event.target.value,
    });
  };

  return (
    <RadioGroup
      name={`question-${question.id}-options`}
      value={activeAnswer ?? ""}
      onChange={handleAnswerChange}
    >
      {question.definition.options.map((option, index) => (
        <FormControlLabel
          key={`question-${question.id}-option-${index}`}
          value={option}
          control={<Radio />}
          label={option}
        />
      ))}
    </RadioGroup>
  );
}

function MultipleAllowedAnswers({ question }: MultipleChoiceQuestionProps) {
  return (
    <FormGroup>
      {question.definition.options.map((option, index) => (
        <FormControlLabel
          key={`question-${question.id}-option-${index}`}
          control={<Checkbox value={index} />}
          label={option}
        />
      ))}
    </FormGroup>
  );
}

export function MultipleChoiceQuestion({
  question,
  dispatch,
  activeAnswer,
}: QuestionProps) {
  assertMultipleChoiceQuestion(question);
  const { multipleChoiceType } = question.definition;

  return (
    <div>
      <Typography variant="body1">{question.question}</Typography>
      <FormControl>
        <RadioGroup aria-labelledby="question" name={`${question.id}-options`}>
          {multipleChoiceType === "multipleAnswers" ? (
            <MultipleAllowedAnswers
              question={question}
              dispatch={dispatch}
              activeAnswer={activeAnswer}
            />
          ) : (
            <SingleAllowedAnswers
              question={question}
              dispatch={dispatch}
              activeAnswer={activeAnswer}
            />
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
