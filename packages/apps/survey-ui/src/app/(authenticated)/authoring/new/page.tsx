"use client";

import { Fab, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import buttonStyles from "@styles/buttons.module.css";
import { Cancel, Save } from "@mui/icons-material";
import clsx from "clsx";

import { SurveyEditor } from "../../../surveys/survey-editor";
import styles from "../styles.module.css";

export default function Page() {
  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Create a new survey</Typography>
      <SurveyEditor />
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
