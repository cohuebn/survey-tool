"use client";

import { Box, CircularProgress, Fab, Tab, Tabs } from "@mui/material";
import React, { useCallback, useMemo, useReducer } from "react";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { Add, Cancel, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { TabPanel } from "../../core-components/tab-panel";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { SurveyEditorState, ValidatedSurveyEditorState } from "../types";

import { saveEditedSurvey } from "./save-edited-survey";
import styles from "./styles.module.css";
import { surveyEditorReducer } from "./survey-editor-reducer";
import { SurveySummaryEditor } from "./survey-summary-editor";
import { getValidatedSurveyState } from "./survey-editor-validation";
import { QuestionsEditor } from "./questions-editor";
import { PermissionsEditor } from "./permissions-editor";

type SurveyEditorProps = {
  initialEditorState: SurveyEditorState;
};

/** Props to ensure tabs are accessible */
function a11yTabProps(name: string) {
  return {
    id: `survey-${name}-tab`,
    "aria-controls": `survey-${name}-tab`,
  };
}

export function SurveyEditor(props: SurveyEditorProps) {
  const searchParams = useSearchParams();
  const initialTab = useMemo(
    () => searchParams.get("tab") ?? "summary",
    [searchParams],
  );
  const [editorState, dispatch] = useReducer(
    surveyEditorReducer,
    getValidatedSurveyState(props.initialEditorState),
  );
  const [selectedTab, setSelectedTab] = React.useState(initialTab);
  const dbClient = useSupabaseDb();
  const currentPath = usePathname();
  const router = useRouter();

  const onTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    router.push(`/authoring/${editorState.surveyId}?tab=${newValue}`);
  };

  // Using callback here to avoid rebuilding on editor state changes; only
  // changes when the dbClient changes
  const save = useCallback(
    async (_editorState: ValidatedSurveyEditorState) => {
      if (!dbClient.clientLoaded) {
        toast.error("Database client not loaded; cannot save survey");
        return;
      }
      await saveEditedSurvey(dbClient.client, _editorState);
      toast.success("Saved survey");
      if (!currentPath.includes(editorState.surveyId)) {
        router.push(`/authoring/${editorState.surveyId}`);
        window.location.href = "/authoring";
      }
    },
    [dbClient, editorState.surveyId, currentPath, router],
  );

  const addQuestion = useCallback(() => {
    dispatch({ type: "addQuestion" });
  }, [dispatch]);

  if (!dbClient.clientLoaded) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.contentWithBottomActions}>
      <Box
        className={styles.surveyTabsContainer}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs variant="fullWidth" value={selectedTab} onChange={onTabChange}>
          <Tab label="Summary" value="summary" {...a11yTabProps("summary")} />
          <Tab
            label="Questions"
            value="questions"
            {...a11yTabProps("questions")}
          />
          <Tab
            label="Permissions"
            value="permissions"
            {...a11yTabProps("permissions")}
          />
        </Tabs>
      </Box>
      <TabPanel
        id={"survey-summary-tab-panel"}
        tabValue="summary"
        selectedValue={selectedTab}
      >
        <SurveySummaryEditor
          summary={editorState.summary}
          validationErrors={editorState.validationErrors.summary}
          dispatch={dispatch}
        />
      </TabPanel>
      <TabPanel
        id="survey-questions-tab-panel"
        tabValue="questions"
        selectedValue={selectedTab}
      >
        <QuestionsEditor
          questions={editorState.questions}
          validationErrors={editorState.validationErrors.questions}
          dispatch={dispatch}
        />
      </TabPanel>
      <TabPanel
        id="survey-permissions-tab-panel"
        tabValue="permissions"
        selectedValue={selectedTab}
      >
        <PermissionsEditor
          permissions={editorState.permissions}
          dispatch={dispatch}
        />
      </TabPanel>
      <div className={layoutStyles.bottomActions}>
        <Fab
          variant="extended"
          color="secondary"
          className={buttonStyles.actionButton}
          onClick={() => window.location.reload()}
        >
          <Cancel className={buttonStyles.actionButtonIcon} />
          Cancel
        </Fab>
        {selectedTab === "questions" ? (
          <Fab
            variant="extended"
            color="primary"
            className={buttonStyles.actionButton}
            disabled={!editorState.isSurveyValid}
            onClick={() => addQuestion()}
          >
            <Add className={buttonStyles.actionButtonIcon} />
            Add a question
          </Fab>
        ) : null}
        <Fab
          variant="extended"
          color="primary"
          className={buttonStyles.actionButton}
          disabled={!editorState.isSurveyValid}
          onClick={() => save(editorState)}
        >
          <Save className={buttonStyles.actionButtonIcon} />
          Save
        </Fab>
      </div>
    </div>
  );
}
