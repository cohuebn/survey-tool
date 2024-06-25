import { EditableSummary } from "./authoring";
import { EditableQuestion, QuestionType } from "./questions";

/** All allowed actions for editing a survey */
export type SurveyEditorAction =
  | { type: "setSurveyName"; value: EditableSummary["name"] }
  | { type: "setSurveySubtitle"; value: EditableSummary["subtitle"] }
  | { type: "setSurveyDescription"; value: EditableSummary["description"] }
  | { type: "addQuestion" }
  | { type: "deleteQuestion"; questionId: string }
  | {
      type: "setQuestionText";
      questionId: string;
      value: EditableQuestion["question"];
    }
  | {
      type: "moveQuestion";
      questionId: string;
      targetIndex: number;
    }
  | {
      type: "setQuestionType";
      questionId: string;
      value?: QuestionType;
    }
  | {
      type: "updateQuestionDefinition";
      questionId: string;
      value: Record<string, unknown>;
    }
  | {
      type: "addQuestionOption";
      questionId: string;
    }
  | {
      type: "updateQuestionOption";
      questionId: string;
      optionIndex: number;
      value: string;
    }
  | {
      type: "deleteQuestionOption";
      questionId: string;
      optionIndex: number;
    }
  | {
      type: "moveQuestion";
      questionId: string;
      optionId: string;
      targetIndex: number;
    };
