import {
  SurveyEditorState,
  EditableSummary,
  SurveyEditorAction,
} from "./types";

function getUpdatedSummary<TFieldKey extends keyof EditableSummary>(
  existingSummary: EditableSummary,
  field: TFieldKey,
  value: EditableSummary[TFieldKey],
): EditableSummary {
  return { ...existingSummary, [field]: value };
}

export function surveyEditorReducer(
  editorState: SurveyEditorState,
  action: SurveyEditorAction,
) {
  switch (action.type) {
    case "setSurveyName":
      return {
        ...editorState,
        summary: getUpdatedSummary(editorState.summary, "name", action.value),
      };
    case "setSurveySubtitle":
      return {
        ...editorState,
        summary: getUpdatedSummary(
          editorState.summary,
          "subtitle",
          action.value,
        ),
      };
    case "setSurveyDescription":
      return {
        ...editorState,
        summary: getUpdatedSummary(
          editorState.summary,
          "description",
          action.value,
        ),
      };
    default:
      throw new Error(
        `The survey editor has been given an unknown action: ${action}`,
      );
  }
}
