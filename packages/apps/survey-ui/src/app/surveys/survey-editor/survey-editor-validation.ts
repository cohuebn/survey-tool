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

function getQuestionErrors(
  question: EditableQuestion,
  index: number,
): SurveyValidationError[] {
  return emptyToUndefined(question.question)
    ? []
    : [
        new SurveyValidationError(
          `Question #${index + 1} is missing question text`,
        ),
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
