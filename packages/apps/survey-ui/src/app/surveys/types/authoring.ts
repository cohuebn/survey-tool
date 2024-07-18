import { SurveyPermissionDetails } from "./permissions";
import { EditableQuestion, Question } from "./questions";
import { SurveySummary } from "./summaries";
import { SurveyValidationError } from "./survey-validation-error";

export type EditableSummary = Partial<SurveySummary>;

/**
 * The state of a survey that is being edited; this state represents
 * a survey that might be invalid or incomplete (editing in progress)
 */
export type SurveyEditorState = {
  surveyId: string;
  summary: EditableSummary;
  questions: EditableQuestion[];
  deletedQuestionIds: string[];
  permissions: SurveyPermissionDetails;
  deletedLocationRestrictionIds: string[];
  deletedDepartmentRestrictionIds: string[];
};

export type ValidSurveyEditorState = Omit<
  SurveyEditorState,
  "summary" | "questions"
> & {
  isSurveyValid: true;
  summary: SurveySummary;
  questions: Question[];
  validationErrors: {
    summary: [];
    questions: [];
  };
};

export type InvalidSurveyEditorState = SurveyEditorState & {
  isSurveyValid: false;
  validationErrors: {
    summary: SurveyValidationError[];
    questions: SurveyValidationError[];
  };
};

/**
 * The state of a survey that is being edited; in addition to the standard
 * survey editor data fields, this state includes validation errors and a flag
 * indicating whether the survey as a whole is valid. If the survey is
 * valid, the less fuzzy full survey types will be returned for summary, questions, etc.
 */
export type ValidatedSurveyEditorState =
  | ValidSurveyEditorState
  | InvalidSurveyEditorState;
