"use client";

import {
  Alert,
  CircularProgress,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Create, Search } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import buttonStyles from "@styles/buttons.module.css";
import searchSurveysStyles from "@styles/search-surveys.module.css";

import { useUserSession } from "../../auth/use-user-session";
import { useSurveySummaries, SurveyFilters, SurveysList } from "../../surveys";
import { FileIssueLink } from "../../issues/file-issue-link";
import { useFilteredSurveys } from "../../surveys/surveys-list/use-filtered-surveys";

export default function Authoring() {
  const { userId } = useUserSession();
  // A silly little memoized object to avoid the filters changing on every render
  const surveyFilters: SurveyFilters = useMemo(
    () => ({ ownerId: userId }),
    [userId],
  );
  const { surveySummaries, surveySummariesLoaded } =
    useSurveySummaries(surveyFilters);
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
        <Typography variant="h2">Surveys</Typography>

        <TextField
          className={searchSurveysStyles.searchSurveys}
          type="text"
          value={surveySearch}
          onChange={(e) => setSurveySearch(e.target.value)}
          placeholder="Search surveys"
          InputProps={{
            endAdornment: <Search />,
          }}
        />
        {filteredSurveySummaries.length ? (
          <SurveysList
            surveys={surveySummaries}
            linkText="Author survey"
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
