import { AppSupabaseClient } from "../../supabase/supabase-context";
import { deleteQuestions, saveQuestions } from "../questions";
import { saveSurveySummary } from "../summaries";
import { ValidatedSurveyEditorState } from "../types";

/** Save an editable survey; if the survey isn't valid throw an error */
export async function saveEditedSurvey(
  dbClient: AppSupabaseClient,
  editorState: ValidatedSurveyEditorState,
) {
  if (!editorState.isSurveyValid) {
    throw new Error("Please fix all validation errors before saving");
  }

  await saveSurveySummary(dbClient, editorState.summary);
  await Promise.all([
    saveQuestions(dbClient, editorState.questions),
    deleteQuestions(dbClient, editorState.deletedQuestionIds),
  ]);
}
