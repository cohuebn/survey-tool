import { Dispatch } from "react";

import { SurveyEditorAction } from "../types";

/** Properties for question editor defintion sections; shared by the different question types */
export type QuestionDefinitionProps = {
  questionId: string;
  definition: Record<string, unknown>;
  dispatch: Dispatch<SurveyEditorAction>;
};
