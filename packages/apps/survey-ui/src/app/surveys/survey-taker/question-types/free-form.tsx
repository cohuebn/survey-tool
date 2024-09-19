import { TextField, Typography } from "@mui/material";
import { isNullOrUndefined } from "@survey-tool/core";

import { QuestionProps } from "../../types/survey-taking";
import {
  FreeFormQuestion as FreeFormQuestionModel,
  Question,
} from "../../types";

import { assertSingleAnswer } from "./answer-assertions";

function assertFreeFormQuestion(
  question: Question,
): asserts question is FreeFormQuestionModel {
  const { definition } = question;
  const definitionKeys = Object.keys(definition);
  if (definitionKeys.length && !definitionKeys.includes("textLength")) {
    throw new Error("Not a free form question");
  }
}

export function FreeFormQuestion({
  question,
  activeAnswer,
  dispatch,
}: QuestionProps) {
  assertFreeFormQuestion(question);
  assertSingleAnswer(question.id, activeAnswer);

  const handleAnswerChange = (value: string) => {
    dispatch({
      type: "changeAnswer",
      questionId: question.id,
      answer: value,
    });
  };

  const isLongQuestion = question.definition.textLength === "long";
  return (
    <div>
      <Typography variant="body1">{question.question}</Typography>
      <TextField
        multiline={isLongQuestion}
        minRows={isLongQuestion ? 5 : 1}
        fullWidth
        value={activeAnswer ?? ""}
        onChange={(event) => handleAnswerChange(event.target.value)}
      />
    </div>
  );
}
