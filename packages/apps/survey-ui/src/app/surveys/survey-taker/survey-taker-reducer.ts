import { Question, SurveySummary } from "../types";
import { SurveyTakerAction } from "../types/survey-taker-action";

type SurveyTakerReducerState = {
  surveyId: string;
  questions: Question[];
  summary: SurveySummary;
  activeQuestionNumber: number;
  activeQuestion: Question;
  activeAnswer: string | number | null;
  answers: Record<string, string>;
  onQuestionChange: (questionNumber: number) => void;
};

function changeQuestion(
  state: SurveyTakerReducerState,
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

function changeAnswer(
  state: SurveyTakerReducerState,
  questionId: string,
  answer: string,
) {
  return {
    ...state,
    answers: {
      ...state.answers,
      [questionId]: answer,
    },
    activeAnswer: answer,
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
    case "changeAnswer": {
      return changeAnswer(state, action.questionId, action.answer);
    }
    default:
      return state;
  }
}
