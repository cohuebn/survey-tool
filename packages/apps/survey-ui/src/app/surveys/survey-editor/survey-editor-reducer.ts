import { arrayMove } from "@dnd-kit/sortable";
import { isObject } from "@survey-tool/core";

import { createNewEditableQuestion } from "../questions";
import {
  SurveyPermissions,
  EditableQuestion,
  EditableSummary,
  SurveyEditorAction,
  SurveyEditorState,
  ValidatedSurveyEditorState,
  SurveyPermissionDetails,
  SurveyAllowedLocation,
  SurveyAllowedDepartment,
  MultipleChoiceOption,
} from "../types";
import { getOptions } from "../questions/definitions";
import { Hospital } from "../../hospitals/types";
import { toSurveyAllowedLocation } from "../permissions/survey-allowed-locations";
import { toSurveyAllowedDepartment } from "../permissions/survey-allowed-departments";

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
    const option: MultipleChoiceOption = { value: "", numericValue: 0 };
    const updatedOptions = [...options, option];
    return { ...definition, options: updatedOptions };
  });
}

function updateQuestionOptionText(
  editorState: SurveyEditorState,
  questionId: string,
  index: number,
  value: string,
): SurveyEditorState {
  return updateQuestionDefinition(editorState, questionId, (definition) => {
    const options = getOptions(definition);
    const updatedOptions = Object.assign([], options, {
      [index]: { ...options[index], value },
    });
    return { ...definition, options: updatedOptions };
  });
}

function updateQuestionOptionRating(
  editorState: SurveyEditorState,
  questionId: string,
  index: number,
  numericValue: number,
): SurveyEditorState {
  return updateQuestionDefinition(editorState, questionId, (definition) => {
    const options = getOptions(definition);
    const updatedOptions = Object.assign([], options, {
      [index]: { ...options[index], numericValue },
    });
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
  const existingIndex = options.map((x) => x.value).indexOf(option);
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

function patchPermissions(
  editorState: SurveyEditorState,
  patch: Partial<SurveyPermissions>,
): SurveyEditorState {
  const existingPermissionDetails = editorState.permissions;
  const updatedPermissions: SurveyPermissionDetails = {
    ...existingPermissionDetails,
    permissions: { ...existingPermissionDetails.permissions, ...patch },
  };
  return { ...editorState, permissions: updatedPermissions };
}

function updateLocationRestrictions(
  editorState: SurveyEditorState,
  allowedLocations: SurveyAllowedLocation[],
) {
  return {
    ...editorState,
    permissions: {
      ...editorState.permissions,
      locationRestrictions: allowedLocations,
    },
  };
}

function addAllowedLocation(
  editorState: SurveyEditorState,
  hospital: Hospital,
): SurveyEditorState {
  const existingLocations = editorState.permissions.locationRestrictions;
  const locationAlreadyIncluded = existingLocations.some(
    (x) => x.location.id === hospital.id,
  );
  if (locationAlreadyIncluded) return editorState;

  const allowedLocation = toSurveyAllowedLocation(
    editorState.surveyId,
    hospital,
  );
  return updateLocationRestrictions(editorState, [
    ...existingLocations,
    allowedLocation,
  ]);
}

function removeAllowedLocation(
  editorState: SurveyEditorState,
  locationId: string,
): SurveyEditorState {
  const existingLocations = editorState.permissions.locationRestrictions;
  const updatedLocations = existingLocations.filter(
    (location) => location.id !== locationId,
  );
  return {
    ...updateLocationRestrictions(editorState, updatedLocations),
    deletedLocationRestrictionIds: [locationId],
  };
}

function updateDepartmentRestrictions(
  editorState: SurveyEditorState,
  allowedDepartments: SurveyAllowedDepartment[],
): SurveyEditorState {
  return {
    ...editorState,
    permissions: {
      ...editorState.permissions,
      departmentRestrictions: allowedDepartments,
    },
  };
}

function addAllowedDepartment(
  editorState: SurveyEditorState,
  department: string,
): SurveyEditorState {
  const existingDepartments = editorState.permissions.departmentRestrictions;
  const departmentAlreadyIncluded = existingDepartments.some(
    (x) => x.department === department,
  );
  if (departmentAlreadyIncluded) return editorState;

  const allowedDepartment = toSurveyAllowedDepartment(
    editorState.surveyId,
    department,
  );
  return updateDepartmentRestrictions(editorState, [
    ...existingDepartments,
    allowedDepartment,
  ]);
}

function removeAllowedDepartment(
  editorState: SurveyEditorState,
  departmentId: string,
): SurveyEditorState {
  const existingDepartments = editorState.permissions.departmentRestrictions;
  const updatedDepartments = existingDepartments.filter(
    (department) => department.id !== departmentId,
  );
  return {
    ...updateDepartmentRestrictions(editorState, updatedDepartments),
    deletedDepartmentRestrictionIds: [departmentId],
  };
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
    case "updateQuestionOptionText":
      return updateQuestionOptionText(
        editorState,
        action.questionId,
        action.optionIndex,
        action.value,
      );
    case "updateQuestionOptionRating":
      return updateQuestionOptionRating(
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
    case "setIsPublic":
      return patchPermissions(editorState, {
        isPublic: action.value,
        restrictByLocation: false,
        restrictByDepartment: false,
      });
    case "setRestrictByLocation":
      return patchPermissions(editorState, {
        restrictByLocation: action.value,
      });
    case "setRestrictByDepartment":
      return patchPermissions(editorState, {
        restrictByDepartment: action.value,
      });
    case "addAllowedLocation":
      return addAllowedLocation(editorState, action.value);
    case "removeAllowedLocation":
      return removeAllowedLocation(editorState, action.value);
    case "addAllowedDepartment":
      return addAllowedDepartment(editorState, action.value);
    case "removeAllowedDepartment":
      return removeAllowedDepartment(editorState, action.value);
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
