"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { v4 as uuidV4 } from "uuid";
import { createLogger } from "@survey-tool/core";
import React from "react";

import { TabPanel } from "../core-components/tab-panel";

import { Survey } from "./types";
import styles from "./styles.module.css";

type SurveyEditorProps = {
  surveyId?: string;
  survey?: Survey;
};

const logger = createLogger("survey-editor");

/** Props to ensure tabs are accessible */
function a11yTabProps(name: string) {
  return {
    id: `survey-${name}-tab`,
    "aria-controls": `survey-${name}-tab`,
  };
}

export function SurveyEditor(props: SurveyEditorProps) {
  const surveyId = props.surveyId ?? uuidV4();
  logger.info({ surveyId }, "Editing survey");
  const [selectedTab, setSelectedTab] = React.useState("summary");

  const onTabChange = (_event: React.SyntheticEvent, newValue: string) =>
    setSelectedTab(newValue);

  return (
    <>
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
        Summary
      </TabPanel>
      <TabPanel
        id="survey-questions-tab-panel"
        tabValue="questions"
        selectedValue={selectedTab}
      >
        Questions
      </TabPanel>
      <TabPanel
        id="survey-permissions-tab-panel"
        tabValue="permissions"
        selectedValue={selectedTab}
      >
        Permissions
      </TabPanel>
    </>
  );
}
