import { PhysicianRole } from "../../users/types";
import { Answer, Question, SurveySummary } from "../types";
import { SurveyTakerAction } from "../types/survey-taker-action";

type SurveyTakerReducerState = {
  surveyId: string;
  selectedPhysicianRole: PhysicianRole | null;
  questions: Question[];
  summary: SurveySummary;
  activeQuestionNumber: number;
  activeQuestion: Question;
  activeAnswer: Answer | null;
  answers: Record<string, Answer>;
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
  answer: Answer,
) {
  return {
    ...state,
    answers: { ...state.answers, [questionId]: answer },
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
    case "moveToNextQuestion":
      return state.activeQuestionNumber === state.questions.length
        ? state
        : changeQuestion(state, state.activeQuestionNumber + 1);
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
    case "setPhysicianRole":
      return { ...state, selectedPhysicianRole: action.role };
    default:
      return state;
  }
}
