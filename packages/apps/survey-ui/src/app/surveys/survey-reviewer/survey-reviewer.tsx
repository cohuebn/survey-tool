import { ChangeEvent, useReducer } from "react";
import { Pagination, Typography } from "@mui/material";

import {
  AggregatedAnswersForQuestions,
  Question,
  SurveySummary,
} from "../types";

import { surveyReviewerReducer } from "./survey-reviewer-reducer";
import styles from "./styles.module.css";
import { renderQuestion } from "./question-review";

type SurveyReviewerProps = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  answers: AggregatedAnswersForQuestions;
  initialQuestionNumber: number;
};

export function SurveyReviewer({
  surveyId,
  summary,
  questions,
  answers,
  initialQuestionNumber,
}: SurveyReviewerProps) {
  const activeQuestion = questions[initialQuestionNumber - 1];
  const [surveyReviewerState, dispatch] = useReducer(surveyReviewerReducer, {
    surveyId,
    summary,
    questions,
    activeQuestionNumber: initialQuestionNumber,
    activeQuestion,
    answers,
    onQuestionChange: (questionNumber: number) => {
      window.history.pushState(
        null,
        "",
        `/results/${surveyId}/questions/${questionNumber}`,
      );
    },
  });

  return (
    <>
      <div className={styles.questionContent}>
        <Typography className={styles.surveyTitle} variant="h2">
          {summary.name}
        </Typography>
        {renderQuestion({
          question: surveyReviewerState.activeQuestion,
          answers:
            surveyReviewerState.answers[surveyReviewerState.activeQuestion.id],
          dispatch,
        })}
      </div>
      <div className={styles.questionsNavigation}>
        <Pagination
          count={questions.length}
          page={surveyReviewerState.activeQuestionNumber}
          color="primary"
          onChange={(_: ChangeEvent<unknown>, questionNumber: number) =>
            dispatch({ type: "setQuestionNumber", value: questionNumber })
          }
        />
      </div>
    </>
  );
}
