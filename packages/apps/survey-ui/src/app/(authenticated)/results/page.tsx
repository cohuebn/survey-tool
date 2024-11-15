"use client";

import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import searchSurveysStyles from "@styles/search-surveys.module.css";

import { SurveysList, useSurveySummaries } from "../../surveys";
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
        fullWidth
        className={searchSurveysStyles.searchSurveys}
        type="text"
        value={surveySearch}
        onChange={(e) => setSurveySearch(e.target.value)}
        placeholder="Search surveys"
        InputProps={{
          endAdornment: <Search />,
        }}
      />
      <SurveysList
        surveys={filteredSurveySummaries}
        actionsBuilder={(survey) => (
          <>
            <Button
              variant="contained"
              href={`/results/${survey.id}/questions/1`}
            >
              Survey answers
            </Button>
            <Button
              variant="outlined"
              href={`/results/${survey.id}/overall-ratings/`}
            >
              Overall ratings
            </Button>
            <Button
              variant="outlined"
              href={`/api/surveys/${survey.id}/answers/aggregated/csv`}
            >
              Export results CSV
            </Button>
          </>
        )}
      />
    </div>
  );
}
