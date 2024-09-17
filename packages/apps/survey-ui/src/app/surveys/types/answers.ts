// Encapsulating these types in case single answer/multi answer types
// need to support additional primitives in the future
export type SingleAnswer = string;
export type MultiAnswer = string[];
export type Answer = SingleAnswer | MultiAnswer;

export type SavableAnswer = {
  participantId: string;
  surveyId: string;
  questionId: string;
  answer: SingleAnswer;
  answerTime: Date;
};

export type DBAnswer = SavableAnswer & {
  id: string;
};
