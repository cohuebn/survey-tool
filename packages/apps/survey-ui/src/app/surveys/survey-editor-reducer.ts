import { getValidatedSurveyState } from "./survey-editor-validation";
import {
  EditableSummary,
  SurveyEditorAction,
  SurveyEditorState,
  ValidatedSurveyEditorState,
} from "./types";

function getUpdatedSummary<TFieldKey extends keyof EditableSummary>(
  existingSummary: EditableSummary,
  field: TFieldKey,
  value: EditableSummary[TFieldKey],
): EditableSummary {
  return { ...existingSummary, [field]: value };
}

function updateSummaryAndValidateState<TFieldKey extends keyof EditableSummary>(
  editorState: SurveyEditorState,
  field: TFieldKey,
  value: EditableSummary[TFieldKey],
): ValidatedSurveyEditorState {
  const updatedSummary = getUpdatedSummary(editorState.summary, field, value);
  return getValidatedSurveyState({ ...editorState, summary: updatedSummary });
}

export function surveyEditorReducer(
  editorState: ValidatedSurveyEditorState,
  action: SurveyEditorAction,
) {
  switch (action.type) {
    case "setSurveyName":
      return updateSummaryAndValidateState(editorState, "name", action.value);
    case "setSurveySubtitle":
      return updateSummaryAndValidateState(
        editorState,
        "subtitle",
        action.value,
      );
    case "setSurveyDescription":
      return updateSummaryAndValidateState(
        editorState,
        "description",
        action.value,
      );
    default:
      throw new Error(
        `The survey editor has been given an unknown action: ${action}`,
      );
  }
}
