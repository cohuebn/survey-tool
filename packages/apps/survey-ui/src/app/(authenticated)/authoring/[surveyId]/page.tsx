"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useMemo } from "react";

import { SurveyEditor } from "../../../surveys/survey-editor";
import { useUserId } from "../../../auth/use-user-id";
import { SurveyEditorState, SurveySummary } from "../../../surveys/types";
import { useSurveySummary } from "../../../surveys/use-survey-summary";

type PageProps = {
  params: { surveyId: string };
};

function getExistingSurveyState(summary: SurveySummary): SurveyEditorState {
  return {
    surveyId: summary.id,
    summary,
  };
}

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary, surveySummaryLoaded } = useSurveySummary(surveyId);
  const initialEditorState = useMemo(
    () => (surveySummary ? getExistingSurveyState(surveySummary) : null),
    [surveySummary],
  );

  if (!userId || !surveySummaryLoaded) {
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
