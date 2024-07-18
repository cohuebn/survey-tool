"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { v4 as uuidV4 } from "uuid";
import { useMemo } from "react";

import { SurveyEditor, SurveyEditorState } from "../../../surveys";
import { useUserId } from "../../../auth/use-user-id";
import { getInitialPermissionDetails } from "../../../surveys/permissions/initial-permissions";

function getNewSurveyState(ownerId: string): SurveyEditorState {
  const surveyId = uuidV4();
  return {
    surveyId,
    summary: { id: surveyId, ownerId },
    questions: [],
    deletedQuestionIds: [],
    permissions: getInitialPermissionDetails(surveyId),
    deletedLocationRestrictionIds: [],
    deletedDepartmentRestrictionIds: [],
  };
}

export default function Page() {
  const userId = useUserId();
  const initialEditorState = useMemo(
    () => (userId ? getNewSurveyState(userId) : null),
    [userId],
  );

  if (!userId) {
    return <CircularProgress />;
  }

  if (!initialEditorState) {
    throw new Error(`Failed to setup initial survey state for user ${userId}`);
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Create a new survey</Typography>
      <SurveyEditor
        initialEditorState={initialEditorState}
        isNewSurvey={true}
      />
    </div>
  );
}
