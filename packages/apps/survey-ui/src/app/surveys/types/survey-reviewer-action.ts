export type SurveyReviewerAction =
  | { type: "setQuestionNumber"; value: number }
  | { type: "moveToNextQuestion" };
