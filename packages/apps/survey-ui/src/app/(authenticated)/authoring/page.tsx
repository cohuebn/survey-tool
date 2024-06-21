"use client";

import { Alert, CircularProgress, Fab, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import buttonStyles from "@styles/buttons.module.css";
import { useMemo } from "react";
import { Create } from "@mui/icons-material";

import { useUserSession } from "../../auth/use-user-session";
import { useSurveys } from "../../surveys/use-surveys";
import { SurveyFilters } from "../../surveys/types";
import { SurveysList } from "../../surveys/surveys-list";
import { FileIssueLink } from "../../issues/file-issue-link";

import styles from "./styles.module.css";

export default function Authoring() {
  const { userId } = useUserSession();
  // A silly little memoized object to avoid the filters changing on every render
  const surveyFilters: SurveyFilters = useMemo(
    () => ({ ownerId: userId }),
    [userId],
  );
  const { surveys, surveysLoaded } = useSurveys(surveyFilters);

  if (!surveysLoaded) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className={layoutStyles.centeredContent}>
        <Typography variant="h2">Surveys</Typography>

        {surveys.length ? (
          <SurveysList surveys={surveys} />
        ) : (
          <Alert severity="info">
            No surveys found that you can author. If you believe you should have
            surveys available, please <FileIssueLink />
          </Alert>
        )}
      </div>
      <div className={styles.bottomActions}>
        <Fab
          className={buttonStyles.actionButton}
          variant="extended"
          color="primary"
          href="/authoring/new"
        >
          <Create />
          Create a survey
        </Fab>
      </div>
    </>
  );
}
