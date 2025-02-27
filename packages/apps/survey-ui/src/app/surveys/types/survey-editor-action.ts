import { Hospital } from "../../hospitals/types";

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
      type: "updateQuestionOptionText";
      questionId: string;
      optionIndex: number;
      value: string;
    }
  | {
      type: "updateQuestionOptionRating";
      questionId: string;
      optionIndex: number;
      value: number;
    }
  | {
      type: "deleteQuestionOption";
      questionId: string;
      optionIndex: number;
    }
  | {
      type: "moveOption";
      questionId: string;
      option: string;
      targetIndex: number;
    }
  | {
      type: "setIsPublic";
      value: boolean;
    }
  | {
      type: "setRestrictByLocation";
      value: boolean;
    }
  | {
      type: "setRestrictByDepartment";
      value: boolean;
    }
  | {
      type: "addAllowedLocation";
      value: Hospital;
    }
  | {
      type: "removeAllowedLocation";
      value: string;
    }
  | {
      type: "addAllowedDepartment";
      value: string;
    }
  | {
      type: "removeAllowedDepartment";
      value: string;
    };
