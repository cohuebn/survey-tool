"use client";

import { CircularProgress, Fab, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import buttonStyles from "@styles/buttons.module.css";
import { Cancel, Save } from "@mui/icons-material";
import clsx from "clsx";
import { v4 as uuidV4 } from "uuid";
import { useMemo } from "react";

import { SurveyEditor } from "../../../surveys/survey-editor";
import styles from "../styles.module.css";
import { useUserId } from "../../../auth/use-user-id";
import { SurveyEditorState } from "../../../surveys/types";

function getNewSurveyState(ownerId: string): SurveyEditorState {
  const surveyId = uuidV4();
  return {
    surveyId,
    summary: { id: surveyId, ownerId },
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
      <SurveyEditor initialEditorState={initialEditorState} />
      <div className={clsx(styles.bottomActions)}>
        <Fab
          variant="extended"
          color="secondary"
          href="/authoring/new"
          className={buttonStyles.actionButton}
        >
          <Cancel className={buttonStyles.actionButtonIcon} />
          Cancel
        </Fab>
        <Fab
          variant="extended"
          color="primary"
          href="/authoring/new"
          className={buttonStyles.actionButton}
        >
          <Save className={buttonStyles.actionButtonIcon} />
          Save
        </Fab>
      </div>
    </div>
  );
}
