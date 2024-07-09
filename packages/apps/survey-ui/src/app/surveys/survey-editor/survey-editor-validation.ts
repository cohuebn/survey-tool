import { isNullOrUndefined } from "@survey-tool/core";

import { emptyToUndefined } from "../../utils/empty-to-undefined";
import {
  SurveyValidationError,
  EditableSummary,
  SurveyEditorState,
  SurveySummary,
  ValidatedSurveyEditorState,
  EditableQuestion,
  Question,
} from "../types";

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

function isOptionsList(options: unknown | undefined): options is string[] {
  return Array.isArray(options);
}

function getTopLevelQuestionErrors(
  question: EditableQuestion,
  index: number,
): SurveyValidationError[] {
  const requiredFieldMap = {
    "question type": question.questionType?.questionType,
    "question text": question.question,
  };
  return Object.entries(requiredFieldMap).reduce<SurveyValidationError[]>(
    (errors, [fieldName, fieldValue]) => {
      return isNullOrUndefined(emptyToUndefined(fieldValue))
        ? [
            ...errors,
            new SurveyValidationError(
              `Question #${index + 1} is missing ${fieldName}`,
            ),
          ]
        : errors;
    },
    [],
  );
}

function getEmptyOptionErrors(
  question: EditableQuestion,
  questionIndex: number,
): SurveyValidationError[] {
  const options = question.definition?.options;
  if (!isOptionsList(options)) return [];
  return options.reduce<SurveyValidationError[]>(
    (_emptyOptions, option, optionIndex) => {
      const isOptionEmpty = isNullOrUndefined(emptyToUndefined(option));
      return isOptionEmpty
        ? [
            ..._emptyOptions,
            new SurveyValidationError(
              `Question #${questionIndex + 1} contains empty option #${optionIndex + 1}`,
            ),
          ]
        : _emptyOptions;
    },
    [],
  );
}

function getQuestionOptionErrors(
  question: EditableQuestion,
  index: number,
): SurveyValidationError[] {
  return getEmptyOptionErrors(question, index);
}

function getQuestionErrors(
  question: EditableQuestion,
  index: number,
): SurveyValidationError[] {
  return [
    ...getTopLevelQuestionErrors(question, index),
    ...getQuestionOptionErrors(question, index),
  ];
}

function getQuestionsErrors(
  questions: EditableQuestion[],
): SurveyValidationError[] {
  return questions.flatMap(getQuestionErrors);
}

function areQuestionsValid(
  questions: EditableQuestion[],
  validationErrors: SurveyValidationError[],
): questions is Question[] {
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
  const { summary, questions } = editorState;
  const surveySummaryErrors = getSurveySummaryErrors(summary);
  const questionsErrors = getQuestionsErrors(questions);
  if (
    isSummaryValid(summary, surveySummaryErrors) &&
    areQuestionsValid(questions, questionsErrors)
  ) {
    return {
      ...editorState,
      summary,
      questions,
      isSurveyValid: true,
      validationErrors: {
        summary: [],
        questions: [],
      },
    };
  }

  return {
    ...editorState,
    isSurveyValid: false,
    validationErrors: {
      summary: surveySummaryErrors,
      questions: questionsErrors,
    },
  };
}
