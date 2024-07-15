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
  EditablePermissions,
  SurveyPermissions,
} from "../../../surveys";
import { useUserId } from "../../../auth/use-user-id";
import { useSurveyPermissions } from "../../../surveys/permissions/use-permissions";
import { getInitialPermissions } from "../../../surveys/permissions/initial-permissions";

type PageProps = {
  params: { surveyId: string };
};

function getExistingSurveyState(
  summary: SurveySummary,
  questions: Question[],
  permissions: EditablePermissions,
): SurveyEditorState {
  return {
    surveyId: summary.id,
    summary,
    questions,
    permissions,
    deletedQuestionIds: [],
  };
}

function getDefaultedPermissions(
  permissions: SurveyPermissions | null,
): EditablePermissions {
  return permissions ?? getInitialPermissions();
}

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary, surveySummaryLoaded } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { permissions, permissionsLoaded } = useSurveyPermissions(surveyId);
  const initialEditorState = useMemo(
    () =>
      surveySummary
        ? getExistingSurveyState(
            surveySummary,
            questions,
            getDefaultedPermissions(permissions),
          )
        : null,
    [surveySummary, questions, permissions],
  );

  if (
    !userId ||
    !surveySummaryLoaded ||
    !questionsLoaded ||
    !permissionsLoaded
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
