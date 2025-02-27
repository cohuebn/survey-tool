"use client";

import {
  Button,
  CircularProgress,
  Pagination,
  Typography,
} from "@mui/material";
import { ChangeEvent, useMemo, useReducer } from "react";
import buttonStyles from "@styles/buttons.module.css";
import clsx from "clsx";
import { toast } from "react-toastify";
import { isNullOrUndefined } from "@survey-tool/core";

import { Answer, Question, SurveySummary } from "../types";
import { useUserSettings } from "../../user-settings/use-user-settings";
import { useAccessToken } from "../../users/use-access-token";
import { PhysicianRole } from "../../users/types";

import styles from "./styles.module.css";
import { surveyTakerReducer } from "./survey-taker-reducer";
import { renderQuestion } from "./question-types";
import { PhysicianRoleSelection } from "./physician-role-selection/physician-role-selection";

type SurveyTakerProps = {
  userId: string;
  physicianRoles: PhysicianRole[];
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  answers: Record<string, Answer>;
  initialQuestionNumber: number;
};

export function SurveyTaker({
  userId,
  physicianRoles,
  surveyId,
  summary,
  questions,
  answers,
  initialQuestionNumber,
}: SurveyTakerProps) {
  const activeQuestion = questions[initialQuestionNumber - 1];
  const [surveyTakerState, dispatch] = useReducer(surveyTakerReducer, {
    surveyId,
    selectedPhysicianRole:
      physicianRoles.length === 1 ? physicianRoles[0] : null,
    questions,
    summary,
    activeQuestionNumber: initialQuestionNumber,
    activeQuestion,
    activeAnswer: answers[activeQuestion.id] || null,
    answers,
    onQuestionChange: (questionNumber: number) => {
      window.history.pushState(
        null,
        "",
        `/surveys/${surveyId}/questions/${questionNumber}`,
      );
    },
  });

  const hasAllAnswers = useMemo(() => {
    const answeredQuestions = Object.keys(surveyTakerState.answers);
    const allQuestions = surveyTakerState.questions.map((q) => q.id);
    return answeredQuestions.length === allQuestions.length;
  }, [surveyTakerState.questions, surveyTakerState.answers]);

  const { userSettings, userSettingsLoaded } = useUserSettings(userId);
  const { accessToken, accessTokenLoaded } = useAccessToken();
  if (!userSettingsLoaded || !accessTokenLoaded) {
    return <CircularProgress />;
  }

  if (isNullOrUndefined(surveyTakerState.selectedPhysicianRole)) {
    return (
      <PhysicianRoleSelection
        physicianRoles={physicianRoles}
        onChange={(role) => {
          dispatch({ type: "setPhysicianRole", role });
        }}
      />
    );
  }

  const saveSurvey = async () => {
    if (!accessToken) {
      throw new Error(
        "No access token associated with session; can't save survey",
      );
    }

    const response = await fetch(`/api/surveys/${surveyId}/answers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ answers: surveyTakerState.answers, userId }),
    });
    if (response.ok) {
      toast.success("Survey saved");
    } else {
      toast.error(`Failed to submit survey: ${response.statusText}`);
    }
  };

  return (
    <>
      <div className={styles.questionContent}>
        <Typography className={styles.surveyTitle} variant="h2">
          {summary.name}
        </Typography>
        <Typography className={styles.selectedRoleSubheading} variant="h3">
          {`Role: ${surveyTakerState.selectedPhysicianRole.hospital?.name} - ${surveyTakerState.selectedPhysicianRole.department}`}
        </Typography>
        {renderQuestion({
          userId,
          userSettings,
          question: surveyTakerState.activeQuestion,
          activeAnswer: surveyTakerState.activeAnswer,
          dispatch,
        })}
        <div className={clsx(buttonStyles.buttons, styles.buttons)}>
          <Button
            className={buttonStyles.button}
            disabled={!hasAllAnswers && hasAllAnswers}
            variant="outlined"
            onClick={() => saveSurvey()}
          >
            Save Answers
          </Button>
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
