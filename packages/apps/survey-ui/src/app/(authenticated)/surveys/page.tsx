"use client";

import { CircularProgress, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import layoutStyles from "@styles/layout.module.css";
import { Search } from "@mui/icons-material";

import { useSurveySummaries } from "../../surveys";
import { SurveysList } from "../../surveys/surveys-list/surveys-list";

import styles from "./styles.module.css";

export default function Page() {
  const { surveySummaries, surveySummariesLoaded } = useSurveySummaries({});
  const [surveySearch, setSurveySearch] = useState<string>("");

  // TODO - move this to the API, add more sophisticated permissioned search
  const filteredSurveySummaries = useMemo(() => {
    const normalizedSearch = surveySearch.toLowerCase();
    if (!normalizedSearch) return surveySummaries;

    return surveySummaries.filter(
      (survey) =>
        survey.name.toLocaleLowerCase().includes(normalizedSearch) ||
        survey.subtitle?.toLocaleLowerCase().includes(normalizedSearch) ||
        survey.description?.toLocaleLowerCase().includes(normalizedSearch),
    );
  }, [surveySummaries, surveySearch]);

  if (!surveySummariesLoaded) return <CircularProgress />;

  return (
    <div className={layoutStyles.centeredContent}>
      <TextField
        className={styles.searchSurveys}
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
        linkText="Take survey"
        linkBuilder={(surveyId) => `/surveys/${surveyId}/questions/1`}
      />
    </div>
  );
}
