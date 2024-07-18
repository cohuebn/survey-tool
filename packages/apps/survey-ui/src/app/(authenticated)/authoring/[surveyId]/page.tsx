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
  SurveyPermissionDetails,
} from "../../../surveys";
import { useUserId } from "../../../auth/use-user-id";
import { useSurveyPermissionsWithDetails } from "../../../surveys/permissions/use-permissions-with-details";

type PageProps = {
  params: { surveyId: string };
};

function getExistingSurveyState(
  summary: SurveySummary,
  questions: Question[],
  permissions: SurveyPermissionDetails,
): SurveyEditorState {
  return {
    surveyId: summary.id,
    summary,
    questions,
    deletedQuestionIds: [],
    permissions,
    deletedLocationRestrictionIds: [],
    deletedDepartmentRestrictionIds: [],
  };
}

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary, surveySummaryLoaded } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { permissionDetails, permissionDetailsLoaded } =
    useSurveyPermissionsWithDetails(surveyId);
  const initialEditorState = useMemo(
    () =>
      surveySummary
        ? getExistingSurveyState(surveySummary, questions, permissionDetails)
        : null,
    [surveySummary, questions, permissionDetails],
  );

  if (
    !userId ||
    !surveySummaryLoaded ||
    !questionsLoaded ||
    !permissionDetailsLoaded
  ) {
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
