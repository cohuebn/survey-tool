import { Dispatch } from "react";

import { SurveyTakerAction } from "./survey-taker-action";
import { Question } from "./questions";
import { Answer } from "./answers";
import { UserSettings } from "./user-settings";

export type QuestionProps = {
  userId: string;
  userSettings: UserSettings;
  question: Question;
  activeAnswer: Answer | null;
  dispatch: Dispatch<SurveyTakerAction>;
};
