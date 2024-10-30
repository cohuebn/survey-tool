import { Dispatch } from "react";

import { Question } from "./questions";
import { SurveyReviewerAction } from "./survey-reviewer-action";
import { AggregatedAnswerForQuestion } from "./answers";

export type ReviewQuestionProps = {
  question: Question;
  answers: AggregatedAnswerForQuestion[];
  dispatch: Dispatch<SurveyReviewerAction>;
};
