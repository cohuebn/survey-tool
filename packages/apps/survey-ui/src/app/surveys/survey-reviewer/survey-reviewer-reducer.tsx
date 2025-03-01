import {
  AggregatedAnswersForQuestions,
  AggregatedAnswerWithLocationForQuestion,
  ParticipatingHospital,
  Question,
  SurveySummary,
} from "../types";

type SurveyReviewerReducerState = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  allAnswers: AggregatedAnswerWithLocationForQuestion[];
  answers: AggregatedAnswersForQuestions;
  activeQuestionNumber: number;
  activeQuestion: Question;
  participatingHospitals: ParticipatingHospital[];
  onQuestionChange: (questionNumber: number) => void;
};

type SurveyReviewerAction =
  | { type: "setQuestionNumber"; value: number }
  | { type: "moveToNextQuestion" }
  | { type: "setAnswers"; answers: AggregatedAnswersForQuestions };

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
  action: SurveyReviewerAction,
) {
  switch (action.type) {
    case "setQuestionNumber":
      return changeQuestion(state, action.value);
    case "moveToNextQuestion":
      return state.activeQuestionNumber === state.questions.length
        ? state
        : changeQuestion(state, state.activeQuestionNumber + 1);
    case "setAnswers":
      return { ...state, answers: action.answers };
    default:
      return state;
  }
}
