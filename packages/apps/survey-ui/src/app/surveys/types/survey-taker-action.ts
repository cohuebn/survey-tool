import { Answer } from "./answers";

export type SurveyTakerAction =
  | { type: "setQuestionNumber"; value: number }
  | { type: "submitAnswer"; questionId: string; value: string }
  | { type: "changeAnswer"; questionId: string; answer: Answer };
