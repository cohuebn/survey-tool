import { SnakeCasedPropertiesDeep } from "type-fest";

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

/** All allowed actions for editing a survey */
export type SurveyEditorAction =
  | { type: "setSurveyName"; value: EditableSummary["name"] }
  | { type: "setSurveySubtitle"; value: EditableSummary["subtitle"] }
  | { type: "setSurveyDescription"; value: EditableSummary["description"] };
