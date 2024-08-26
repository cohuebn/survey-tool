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

type MultipleChoiceQuestionProps = {
  question: MultipleChoiceQuestionModel;
};

function SingleAllowedAnswers({ question }: MultipleChoiceQuestionProps) {
  return (
    <RadioGroup name="question-options">
      {question.definition.options.map((option, index) => (
        <FormControlLabel
          key={`question-option-${index}`}
          value={index}
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
          key={`question-option-${index}`}
          control={<Checkbox value={index} />}
          label={option}
        />
      ))}
    </FormGroup>
  );
}

export function MultipleChoiceQuestion({ question }: QuestionProps) {
  assertMultipleChoiceQuestion(question);
  const { options, multipleChoiceType } = question.definition;

  return (
    <div>
      <Typography variant="body1">{question.question}</Typography>
      <FormControl>
        <RadioGroup
          aria-labelledby="question"
          defaultValue={options[0]}
          name="question-options"
        >
          {multipleChoiceType === "multipleAnswers" ? (
            <MultipleAllowedAnswers question={question} />
          ) : (
            <SingleAllowedAnswers question={question} />
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
