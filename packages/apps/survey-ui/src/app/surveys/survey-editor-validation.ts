import { emptyToUndefined } from "../utils/empty-to-undefined";

import { SurveyValidationError } from "./survey-validation-error";
import {
  EditableSummary,
  SurveyEditorState,
  SurveySummary,
  ValidatedSurveyEditorState,
} from "./types";

function getSurveySummaryErrors(
  summary: EditableSummary,
): SurveyValidationError[] {
  return emptyToUndefined(summary.name)
    ? []
    : [new SurveyValidationError("A survey name is required")];
}

function isSummaryValid(
  summary: EditableSummary,
  validationErrors: SurveyValidationError[],
): summary is SurveySummary {
  return !validationErrors.length;
}

/**
 * Validate the provided survey editor state
 * @param editorState The survey editor state to validate. This is the data from the survey editor
 * @returns The validated survey editor state; this includes the data from the survey editor, but
 * also the results of validation
 */
export function getValidatedSurveyState(
  editorState: SurveyEditorState,
): ValidatedSurveyEditorState {
  const { summary } = editorState;
  const surveySummaryErrors = getSurveySummaryErrors(summary);
  if (isSummaryValid(summary, surveySummaryErrors)) {
    return {
      ...editorState,
      summary,
      isSurveyValid: true,
      validationErrors: {
        summary: [],
      },
    };
  }

  return {
    ...editorState,
    isSurveyValid: false,
    validationErrors: {
      summary: surveySummaryErrors,
    },
  };
}
