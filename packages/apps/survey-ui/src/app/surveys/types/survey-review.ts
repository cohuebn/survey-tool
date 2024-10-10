import { Dispatch } from "react";

import { Question } from "./questions";
import { SurveyReviewerAction } from "./survey-reviewer-action";
import { AggregatedAnswersForQuestion } from "./answers";

export type ReviewQuestionProps = {
  question: Question;
  answers: AggregatedAnswersForQuestion[];
  dispatch: Dispatch<SurveyReviewerAction>;
};
