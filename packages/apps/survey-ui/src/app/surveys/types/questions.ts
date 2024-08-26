import { SnakeCasedPropertiesDeep } from "type-fest";

export type QuestionTypeLabel =
  | "Yes/no"
  | "Rating"
  | "Free-form"
  | "Multiple choice"
  | "Ranking";

export type QuestionType = {
  id: string;
  questionType: QuestionTypeLabel;
};

export type DBQuestionType = SnakeCasedPropertiesDeep<QuestionType>;

export type DBQuestion = Omit<
  SnakeCasedPropertiesDeep<{
    id: string;
    surveyId: string;
    questionTypeId: string;
    question: string;
    sortOrder: number;
  }>,
  "definition"
> & {
  definition: Record<string, unknown>;
};

type BaseQuestion = {
  id: string;
  surveyId: string;
  question: string;
  questionType: QuestionType;
  sortOrder: number;
  definition: Record<string, unknown>;
};

export type Question = BaseQuestion;
export type EditableQuestion = Omit<Partial<Question>, "id" | "surveyId"> & {
  id: Question["id"];
  surveyId: Question["surveyId"];
};

export type MultipleChoiceType = "singleAnswer" | "multipleAnswers";
export type MultipleChoiceQuestion = Omit<BaseQuestion, "definition"> & {
  definition: {
    options: string[];
    multipleChoiceType?: MultipleChoiceType;
  };
};

export type RatingQuestion = Omit<BaseQuestion, "definition"> & {
  definition: {
    minRating?: number;
    maxRating?: number;
  };
};
