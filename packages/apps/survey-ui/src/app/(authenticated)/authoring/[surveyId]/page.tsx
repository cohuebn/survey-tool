"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useMemo } from "react";

import {
  SurveyEditor,
  Question,
  SurveyEditorState,
  SurveySummary,
  useSurveySummary,
  useQuestions,
} from "../../../surveys";
import { useUserId } from "../../../auth/use-user-id";

type PageProps = {
  params: { surveyId: string };
};

function getExistingSurveyState(
  summary: SurveySummary,
  questions: Question[],
): SurveyEditorState {
  return {
    surveyId: summary.id,
    summary,
    questions,
    deletedQuestionIds: [],
  };
}

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary, surveySummaryLoaded } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const initialEditorState = useMemo(
    () =>
      surveySummary ? getExistingSurveyState(surveySummary, questions) : null,
    [surveySummary, questions],
  );

  if (!userId || !surveySummaryLoaded || !questionsLoaded) {
    return <CircularProgress />;
  }

  if (!initialEditorState) {
    throw new Error(`Failed to setup initial survey state for user ${userId}`);
  }

  if (userId !== initialEditorState.summary.ownerId) {
    throw new Error(
      `User ${userId} does not have permission to access survey ${surveyId}`,
    );
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Edit this survey</Typography>
      <SurveyEditor initialEditorState={initialEditorState} />
    </div>
  );
}
