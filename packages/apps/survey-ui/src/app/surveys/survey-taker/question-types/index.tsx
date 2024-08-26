import { Dispatch } from "react";

import { Question } from "../../types";
import { SurveyTakerAction } from "../../types/survey-taker-action";

import { MultipleChoiceQuestion } from "./multiple-choice";
import { RatingQuestion } from "./rating";
import { FreeFormQuestion } from "./free-form";

type RenderQuestionProps = {
  question: Question;
  dispatch: Dispatch<SurveyTakerAction>;
};

export function renderQuestion({ question, dispatch }: RenderQuestionProps) {
  switch (question.questionType.questionType) {
    case "Rating":
      return <RatingQuestion question={question} dispatch={dispatch} />;
    case "Free-form":
      return <FreeFormQuestion question={question} dispatch={dispatch} />;
    case "Multiple choice":
      return <MultipleChoiceQuestion question={question} dispatch={dispatch} />;
    default:
      return <></>;
  }
}
