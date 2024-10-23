import {
  AggregatedAnswersForQuestions,
  ParticipatingHospital,
  Question,
  SurveySummary,
} from "../types";
import { SurveyTakerAction } from "../types/survey-taker-action";

type SurveyReviewerReducerState = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  answers: AggregatedAnswersForQuestions;
  activeQuestionNumber: number;
  activeQuestion: Question;
  participatingHospitals: ParticipatingHospital[];
  onQuestionChange: (questionNumber: number) => void;
};

function changeQuestion(
  state: SurveyReviewerReducerState,
  questionNumber: number,
) {
  state.onQuestionChange(questionNumber);
  const activeQuestion = state.questions[questionNumber - 1];
  return {
    ...state,
    activeQuestionNumber: questionNumber,
    activeQuestion,
    activeAnswer: state.answers[activeQuestion.id],
  };
}

export function surveyReviewerReducer(
  state: SurveyReviewerReducerState,
  action: SurveyTakerAction,
) {
  switch (action.type) {
    case "setQuestionNumber":
      return changeQuestion(state, action.value);
    case "moveToNextQuestion":
      return state.activeQuestionNumber === state.questions.length
        ? state
        : changeQuestion(state, state.activeQuestionNumber + 1);
    default:
      return state;
  }
}
