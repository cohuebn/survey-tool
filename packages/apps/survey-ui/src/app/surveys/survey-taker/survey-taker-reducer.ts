import { Question, SurveySummary } from "../types";
import { SurveyTakerAction } from "../types/survey-taker-action";

type SurveyTakerReducerState = {
  surveyId: string;
  questions: Question[];
  summary: SurveySummary;
  activeQuestionNumber: number;
  activeQuestion: Question;
  answers: Record<string, string>;
  onQuestionChange: (questionNumber: number) => void;
};

function changeQuestion(
  state: SurveyTakerReducerState,
  questionNumber: number,
) {
  state.onQuestionChange(questionNumber);
  return {
    ...state,
    activeQuestionNumber: questionNumber,
    activeQuestion: state.questions[questionNumber - 1],
  };
}

export function surveyTakerReducer(
  state: SurveyTakerReducerState,
  action: SurveyTakerAction,
) {
  switch (action.type) {
    case "setQuestionNumber":
      return changeQuestion(state, action.value);
    case "submitAnswer": {
      const nextQuestionNumber = state.activeQuestionNumber + 1;
      const updatedAnswers = {
        ...state.answers,
        [action.questionId]: action.value,
      };
      return {
        ...changeQuestion(state, nextQuestionNumber),
        answers: updatedAnswers,
      };
    }
    default:
      return state;
  }
}
