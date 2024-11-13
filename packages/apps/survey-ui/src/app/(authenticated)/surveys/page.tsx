"use client";

import { CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import searchSurveysStyles from "@styles/search-surveys.module.css";

import { useSurveySummaries } from "../../surveys";
import { SingleActionSurveysList } from "../../surveys/surveys-list/single-action-surveys-list";
import { useFilteredSurveys } from "../../surveys/surveys-list/use-filtered-surveys";

export default function Page() {
  const { surveySummaries, surveySummariesLoaded } = useSurveySummaries({});
  const [surveySearch, setSurveySearch] = useState<string>("");
  const filteredSurveySummaries = useFilteredSurveys(
    surveySummaries,
    surveySearch,
  );

  if (!surveySummariesLoaded) return <CircularProgress />;

  return (
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
      />
      <SingleActionSurveysList
        surveys={filteredSurveySummaries}
        linkText="Take survey"
        linkBuilder={(surveyId) => `/surveys/${surveyId}/questions/1`}
      />
    </div>
  );
}
