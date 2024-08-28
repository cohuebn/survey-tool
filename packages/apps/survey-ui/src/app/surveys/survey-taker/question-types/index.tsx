import { Dispatch } from "react";

import { Question } from "../../types";
import { SurveyTakerAction } from "../../types/survey-taker-action";

import { MultipleChoiceQuestion } from "./multiple-choice";
import { RatingQuestion } from "./rating";
import { FreeFormQuestion } from "./free-form";

type RenderQuestionProps = {
  question: Question;
  activeAnswer: string | number | null;
  dispatch: Dispatch<SurveyTakerAction>;
};

export function renderQuestion(renderQuestionProps: RenderQuestionProps) {
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
