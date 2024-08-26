import { Dispatch } from "react";

import { Question } from "../../types";
import { SurveyTakerAction } from "../../types/survey-taker-action";

export type QuestionProps = {
  question: Question;
  dispatch: Dispatch<SurveyTakerAction>;
};
