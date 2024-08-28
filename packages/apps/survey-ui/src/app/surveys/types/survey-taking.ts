import { Dispatch } from "react";

import { SurveyTakerAction } from "./survey-taker-action";
import { Question } from "./questions";
import { Answer } from "./answers";

export type QuestionProps = {
  question: Question;
  activeAnswer: Answer | null;
  dispatch: Dispatch<SurveyTakerAction>;
};
