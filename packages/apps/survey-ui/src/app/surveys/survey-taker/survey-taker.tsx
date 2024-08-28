"use client";

import { Button, Pagination, Typography } from "@mui/material";
import { ChangeEvent, useReducer } from "react";
import buttonStyles from "@styles/buttons.module.css";
import clsx from "clsx";

import { Question, SurveySummary } from "../types";

import styles from "./styles.module.css";
import { surveyTakerReducer } from "./survey-taker-reducer";
import { renderQuestion } from "./question-types";

type SurveyTakerProps = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  initialQuestionNumber: number;
};

export function SurveyTaker({
  surveyId,
  summary,
  questions,
  initialQuestionNumber,
}: SurveyTakerProps) {
  const [surveyTakerState, dispatch] = useReducer(surveyTakerReducer, {
    surveyId,
    questions,
    summary,
    activeQuestionNumber: initialQuestionNumber,
    activeQuestion: questions[initialQuestionNumber - 1],
    activeAnswer: null,
    answers: {},
    onQuestionChange: (questionNumber: number) => {
      window.history.pushState(
        null,
        "",
        `/surveys/${surveyId}/questions/${questionNumber}`,
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
          question: surveyTakerState.activeQuestion,
          activeAnswer: surveyTakerState.activeAnswer,
          dispatch,
        })}
        <div className={clsx(buttonStyles.buttons, styles.buttons)}>
          <Button
            className={buttonStyles.button}
            variant="contained"
            onClick={() =>
              dispatch({
                type: "setQuestionNumber",
                value: surveyTakerState.activeQuestionNumber + 1,
              })
            }
          >
            Next
          </Button>
        </div>
      </div>
      <div className={styles.questionsNavigation}>
        <Pagination
          count={questions.length}
          page={surveyTakerState.activeQuestionNumber}
          color="primary"
          onChange={(_: ChangeEvent<unknown>, questionNumber: number) =>
            dispatch({ type: "setQuestionNumber", value: questionNumber })
          }
        />
      </div>
    </>
  );
}
