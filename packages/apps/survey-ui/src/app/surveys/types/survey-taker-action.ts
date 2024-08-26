export type SurveyTakerAction =
  | { type: "setQuestionNumber"; value: number }
  | { type: "submitAnswer"; questionId: string; value: string };
