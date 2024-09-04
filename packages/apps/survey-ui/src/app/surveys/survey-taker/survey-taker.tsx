"use client";

import { Button, Pagination, Typography } from "@mui/material";
import { ChangeEvent, useReducer } from "react";
import buttonStyles from "@styles/buttons.module.css";
import clsx from "clsx";
import { toast } from "react-toastify";

import { Question, SurveySummary } from "../types";

import styles from "./styles.module.css";
import { surveyTakerReducer } from "./survey-taker-reducer";
import { renderQuestion } from "./question-types";

type SurveyTakerProps = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  initialQuestionNumber: number;
  userId: string;
};

export function SurveyTaker({
  userId,
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

  // const hasAllAnswers = useMemo(() => {
  //   const answeredQuestions = Object.keys(surveyTakerState.answers);
  //   const allQuestions = surveyTakerState.questions.map((q) => q.id);
  //   return answeredQuestions.length === allQuestions.length;
  // }, [surveyTakerState.questions, surveyTakerState.answers]);

  const submitSurvey = async () => {
    await fetch(`/api/surveys/${surveyId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ answers: surveyTakerState.answers, userId }),
    });
    toast.success("Survey submitted");
  };

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
            disabled={
              surveyTakerState.activeQuestionNumber ===
              surveyTakerState.questions.length
            }
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
          <Button
            className={buttonStyles.button}
            // disabled={!hasAllAnswers}
            variant="contained"
            onClick={() => submitSurvey()}
          >
            Submit Survey
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
