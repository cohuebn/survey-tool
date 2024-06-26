import { arrayMove } from "@dnd-kit/sortable";
import { isNullOrUndefined, isObject } from "@survey-tool/core";

import { createNewEditableQuestion } from "../questions";
import {
  EditableQuestion,
  EditableSummary,
  SurveyEditorAction,
  SurveyEditorState,
  ValidatedSurveyEditorState,
} from "../types";
import { getOptions } from "../questions/definitions";

import { getValidatedSurveyState } from "./survey-editor-validation";

function getUpdatedSummary<TFieldKey extends keyof EditableSummary>(
  existingSummary: EditableSummary,
  field: TFieldKey,
  value: EditableSummary[TFieldKey],
): EditableSummary {
  return { ...existingSummary, [field]: value };
}

function updateSummary<TFieldKey extends keyof EditableSummary>(
  editorState: SurveyEditorState,
  field: TFieldKey,
  value: EditableSummary[TFieldKey],
): SurveyEditorState {
  const updatedSummary = getUpdatedSummary(editorState.summary, field, value);
  return { ...editorState, summary: updatedSummary };
}

// function updateSummaryAndValidateState<TFieldKey extends keyof EditableSummary>(
//   editorState: SurveyEditorState,
//   field: TFieldKey,
//   value: EditableSummary[TFieldKey],
// ): ValidatedSurveyEditorState {
//   const updatedSummary = getUpdatedSummary(editorState.summary, field, value);
//   return getValidatedSurveyState({ ...editorState, summary: updatedSummary });
// }

function updateQuestion<TFieldKey extends keyof EditableQuestion>(
  editorState: SurveyEditorState,
  questionId: string,
  field: TFieldKey,
  value: EditableQuestion[TFieldKey],
): SurveyEditorState {
  const updatedQuestions = editorState.questions.map((question) => {
    return question.id === questionId
      ? { ...question, [field]: value }
      : question;
  });
  return { ...editorState, questions: updatedQuestions };
}

function findQuestionAndIndex(
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
): SurveyEditorState {
  const { questions } = editorState;
  const { index: existingIndex } = findQuestionAndIndex(
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

function deleteQuestion(
  editorState: SurveyEditorState,
  questionId: string,
): SurveyEditorState {
  return {
    ...editorState,
    questions: editorState.questions.filter(
      (question) => question.id !== questionId,
    ),
    deletedQuestionIds: [...editorState.deletedQuestionIds, questionId],
  };
}

type QuestionDefinitionUpdater = (
  existingDefinition: Record<string, unknown>,
) => Record<string, unknown>;

function updateQuestionDefinition(
  editorState: SurveyEditorState,
  questionId: string,
  updateDefinition: QuestionDefinitionUpdater,
) {
  const updatedQuestions = editorState.questions.map((question) => {
    if (question.id !== questionId) return question;
    const existingDefinition = question.definition ?? {};
    return {
      ...question,
      definition: updateDefinition(existingDefinition),
    };
  });
  return { ...editorState, questions: updatedQuestions };
}

function addQuestionOption(editorState: SurveyEditorState, questionId: string) {
  return updateQuestionDefinition(editorState, questionId, (definition) => {
    const options = getOptions(definition);
    return { ...definition, options: [...options, ""] };
  });
}

function updateQuestionOption(
  editorState: SurveyEditorState,
  questionId: string,
  index: number,
  value: string,
): SurveyEditorState {
  return updateQuestionDefinition(editorState, questionId, (definition) => {
    const options = getOptions(definition);
    const updatedOptions = options.map((option, i) =>
      i === index ? value : option,
    );
    return { ...definition, options: updatedOptions };
  });
}

function deleteQuestionOption(
  editorState: SurveyEditorState,
  questionId: string,
  optionIndex: number,
) {
  return updateQuestionDefinition(editorState, questionId, (definition) => {
    const updatedOptions = getOptions(definition).filter(
      (_, index) => index !== optionIndex,
    );
    return { ...definition, options: updatedOptions };
  });
}

/**
 * Move an option for a question to the specified index.
 * @param editorState The current survey editor state
 * @param questionId The id of the question the option is associated with
 * @param option The option to move
 * @param targetIndex The index to move the question to
 * @returns The updated survey editor state
 */
function moveOption(
  editorState: SurveyEditorState,
  questionId: string,
  option: string,
  targetIndex: number,
): SurveyEditorState {
  const { questions } = editorState;
  const { question: existingQuestion } = findQuestionAndIndex(
    editorState,
    questionId,
  );

  const options = getOptions(existingQuestion.definition);

  if (targetIndex < 0 || targetIndex >= options.length) {
    throw new Error(
      `Invalid target index; can't move option. Index: ${targetIndex}, Option count: ${questions.length}`,
    );
  }
  const existingIndex = options.indexOf(option);
  if (existingIndex < 0) {
    throw new Error(`Option ${option} not found in question ${questionId}`);
  }
  const updatedOptions = arrayMove(options, existingIndex, targetIndex);
  return updateQuestionDefinition(editorState, questionId, (definition) => ({
    ...definition,
    options: updatedOptions,
  }));
}

function getUnknownActionError(action: unknown) {
  const actionType =
    isObject(action) && "type" in action ? action.type : "No type on action";
  return new Error(
    `The survey editor has been given an unknown action: ${actionType}`,
  );
}

function getUnvalidatedSurveyState(
  editorState: ValidatedSurveyEditorState,
  action: SurveyEditorAction,
): SurveyEditorState {
  switch (action.type) {
    case "setSurveyName":
      return updateSummary(editorState, "name", action.value);
    case "setSurveySubtitle":
      return updateSummary(editorState, "subtitle", action.value);
    case "setSurveyDescription":
      return updateSummary(editorState, "description", action.value);
    case "addQuestion":
      return {
        ...editorState,
        questions: [
          ...editorState.questions,
          createNewEditableQuestion(
            editorState.surveyId,
            editorState.questions.length,
          ),
        ],
      };
    case "deleteQuestion":
      return deleteQuestion(editorState, action.questionId);
    case "setQuestionText":
      return updateQuestion(
        editorState,
        action.questionId,
        "question",
        action.value,
      );
    case "moveQuestion":
      return moveQuestion(editorState, action.questionId, action.targetIndex);
    case "setQuestionType":
      return updateQuestion(
        editorState,
        action.questionId,
        "questionType",
        action.value,
      );
    case "updateQuestionDefinition":
      return updateQuestion(
        editorState,
        action.questionId,
        "definition",
        action.value,
      );
    case "addQuestionOption":
      return addQuestionOption(editorState, action.questionId);
    case "updateQuestionOption":
      return updateQuestionOption(
        editorState,
        action.questionId,
        action.optionIndex,
        action.value,
      );
    case "deleteQuestionOption":
      return deleteQuestionOption(
        editorState,
        action.questionId,
        action.optionIndex,
      );
    case "moveOption":
      return moveOption(
        editorState,
        action.questionId,
        action.option,
        action.targetIndex,
      );
    default:
      throw getUnknownActionError(action);
  }
}

export function surveyEditorReducer(
  editorState: ValidatedSurveyEditorState,
  action: SurveyEditorAction,
) {
  const updatedState = getUnvalidatedSurveyState(editorState, action);
  return getValidatedSurveyState(updatedState);
}
