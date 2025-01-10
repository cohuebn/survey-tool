"use client";

import { Alert, CircularProgress, Fab, TextField } from "@mui/material";
import { useState } from "react";
import { Create, Search } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import buttonStyles from "@styles/buttons.module.css";
import searchSurveysStyles from "@styles/search-surveys.module.css";

import { useSurveySummaries, SingleActionSurveysList } from "../../surveys";
import { FileIssueLink } from "../../issues/file-issue-link";
import { useFilteredSurveys } from "../../surveys/surveys-list/use-filtered-surveys";

export default function Authoring() {
  const { surveySummaries, surveySummariesLoaded } = useSurveySummaries({
    authoring: true,
  });
  const [surveySearch, setSurveySearch] = useState<string>("");
  const filteredSurveySummaries = useFilteredSurveys(
    surveySummaries,
    surveySearch,
  );

  if (!surveySummariesLoaded) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className={layoutStyles.centeredContent}>
        <TextField
          className={searchSurveysStyles.searchSurveys}
          type="text"
          value={surveySearch}
          onChange={(e) => setSurveySearch(e.target.value)}
          placeholder="Search surveys"
          InputProps={{
            endAdornment: <Search />,
          }}
          fullWidth
        />
        {filteredSurveySummaries.length ? (
          <SingleActionSurveysList
            surveys={filteredSurveySummaries}
            linkText="Edit survey"
            linkBuilder={(surveyId) => `/authoring/${surveyId}`}
          />
        ) : (
          <Alert severity="info">
            No surveys found that you can author. If you believe you should have
            surveys available, please <FileIssueLink />. If you have entered
            search text above, check your search text.
          </Alert>
        )}
      </div>
      <div className={layoutStyles.bottomActions}>
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
