import { SnakeCasedPropertiesDeep } from "type-fest";

import { AppSupabaseClient } from "../supabase/supabase-context";

import { SurveyValidationError } from "./survey-validation-error";

export type SurveySummary = {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  ownerId: string;
};

export type DBSurveySummary = SnakeCasedPropertiesDeep<SurveySummary>;

export type SurveyFilters = {
  ownerId?: string;
};

export type EditableSummary = Partial<SurveySummary>;

/**
 * The state of a survey that is being edited; this state represents
 * a survey that might be invalid or incomplete (editing in progress)
 */
export type SurveyEditorState = {
  surveyId: string;
  summary: EditableSummary;
};

export type ValidSurveyEditorState = {
  surveyId: string;
  isSurveyValid: true;
  summary: SurveySummary;
  validationErrors: {
    summary: [];
  };
};

export type InvalidSurveyEditorState = SurveyEditorState & {
  isSurveyValid: false;
  validationErrors: {
    summary: SurveyValidationError[];
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

/** All allowed actions for editing a survey */
export type SurveyEditorAction =
  | { type: "saveSurvey"; dbClient: AppSupabaseClient }
  | { type: "setSurveyName"; value: EditableSummary["name"] }
  | { type: "setSurveySubtitle"; value: EditableSummary["subtitle"] }
  | { type: "setSurveyDescription"; value: EditableSummary["description"] };
