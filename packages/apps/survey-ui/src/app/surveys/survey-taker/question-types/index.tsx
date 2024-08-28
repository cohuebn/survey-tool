import { QuestionProps } from "../../types/survey-taking";

import { MultipleChoiceQuestion } from "./multiple-choice";
import { RatingQuestion } from "./rating";
import { FreeFormQuestion } from "./free-form";

export function renderQuestion(renderQuestionProps: QuestionProps) {
  switch (renderQuestionProps.question.questionType.questionType) {
    case "Rating":
      return <RatingQuestion {...renderQuestionProps} />;
    case "Free-form":
      return <FreeFormQuestion {...renderQuestionProps} />;
    case "Multiple choice":
      return <MultipleChoiceQuestion {...renderQuestionProps} />;
    default:
      return <></>;
  }
}
