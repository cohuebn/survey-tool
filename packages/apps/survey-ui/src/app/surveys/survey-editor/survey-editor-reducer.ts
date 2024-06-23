import { arrayMove } from "@dnd-kit/sortable";

import { createNewEditableQuestion } from "../questions";
import {
  EditableQuestion,
  EditableSummary,
  SurveyEditorAction,
  SurveyEditorState,
  ValidatedSurveyEditorState,
} from "../types";

import { getValidatedSurveyState } from "./survey-editor-validation";

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

function updateQuestionAndValidateState<
  TFieldKey extends keyof EditableQuestion,
>(
  editorState: SurveyEditorState,
  questionId: string,
  field: TFieldKey,
  value: EditableQuestion[TFieldKey],
) {
  const updatedQuestions = editorState.questions.map((question) => {
    return question.id === questionId
      ? { ...question, [field]: value }
      : question;
  });
  return getValidatedSurveyState({
    ...editorState,
    questions: updatedQuestions,
  });
}

function findQuestionWithIndex(
  editorState: SurveyEditorState,
  questionId: string,
) {
  const { questions } = editorState;
  const questionIndex = questions.findIndex(
    (question) => question.id === questionId,
  );
  if (questionIndex < 0) {
    throw new Error(`Question with id ${questionId} not found`);
  }
  return { index: questionIndex, question: questions[questionIndex] };
}

function reindexQuestions(questions: EditableQuestion[]): EditableQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    sortOrder: index,
  }));
}

/**
 * Move the question with the given id to the specified index
 * @param editorState The current survey editor state
 * @param questionId The id of the question to move
 * @param targetIndex The index to move the question to
 * @returns The updated survey editor state
 */
function moveQuestion(
  editorState: SurveyEditorState,
  questionId: string,
  targetIndex: number,
) {
  const { questions } = editorState;
  const { index: existingIndex } = findQuestionWithIndex(
    editorState,
    questionId,
  );
  if (targetIndex < 0 || targetIndex >= questions.length) {
    throw new Error(
      `Invalid target index; can't move question. Index: ${targetIndex}, Question count: ${questions.length}`,
    );
  }
  const updatedQuestions = arrayMove(questions, existingIndex, targetIndex);
  return { ...editorState, questions: reindexQuestions(updatedQuestions) };
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
    case "addQuestion":
      return getValidatedSurveyState({
        ...editorState,
        questions: [
          ...editorState.questions,
          createNewEditableQuestion(
            editorState.surveyId,
            editorState.questions.length,
          ),
        ],
      });
    case "setQuestionText":
      return updateQuestionAndValidateState(
        editorState,
        action.questionId,
        "question",
        action.value,
      );
    case "moveQuestion":
      return getValidatedSurveyState(
        moveQuestion(editorState, action.questionId, action.targetIndex),
      );
    case "setQuestionType":
      return updateQuestionAndValidateState(
        editorState,
        action.questionId,
        "questionType",
        action.value,
      );
    default:
      throw new Error(
        `The survey editor has been given an unknown action: ${action}`,
      );
  }
}
