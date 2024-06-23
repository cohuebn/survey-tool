import { SnakeCasedPropertiesDeep } from "type-fest";

export type QuestionType = {
  id: string;
  questionType: string;
};

export type DBQuestionType = SnakeCasedPropertiesDeep<QuestionType>;

type BaseQuestion = {
  id: string;
  surveyId: string;
  question: string;
  questionType: QuestionType;
  sortOrder: number;
};

export type DBQuestion = SnakeCasedPropertiesDeep<{
  id: string;
  surveyId: string;
  questionTypeId: string;
  question: string;
  sortOrder: number;
  definition: Record<string, unknown>;
}>;

export type Question = BaseQuestion;
export type EditableQuestion = Omit<Partial<Question>, "id" | "surveyId"> & {
  id: Question["id"];
  surveyId: Question["surveyId"];
};
