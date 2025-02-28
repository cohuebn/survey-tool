"use client";

import { Alert, Button, CircularProgress, Fab, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Create, Search } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import buttonStyles from "@styles/buttons.module.css";
import searchSurveysStyles from "@styles/search-surveys.module.css";
import { isNotNullOrUndefined } from "@survey-tool/core";
import compare from "just-compare";

import { useSurveySummaries, SurveysList, SurveySummary } from "../../surveys";
import { FileIssueLink } from "../../issues/file-issue-link";
import { useFilteredSurveys } from "../../surveys/surveys-list/use-filtered-surveys";

import { DeleteSurveyDialog } from "./delete-survey-dialog";

export default function Authoring() {
  const { surveySummaries, surveySummariesLoaded } = useSurveySummaries({
    authoring: true,
  });
  const [surveySearch, setSurveySearch] = useState<string>("");
  const filteredSurveySummaries = useFilteredSurveys(
    surveySummaries,
    surveySearch,
  );
  const [viewableSurveys, setViewableSurveys] = useState<SurveySummary[]>([]);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const openDeleteDialog = isNotNullOrUndefined(surveyToDelete);

  useEffect(() => {
    const surveyIds = filteredSurveySummaries.map((x) => x.id);
    const viewableSurveyIds = viewableSurveys.map((x) => x.id);
    if (!compare(surveyIds, viewableSurveyIds)) {
      setViewableSurveys(filteredSurveySummaries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSurveySummaries]);

  if (!surveySummariesLoaded) {
    return <CircularProgress />;
  }

  function handleSurveyDeletion(surveyId: string) {
    setViewableSurveys((previousViewableSurveys) =>
      previousViewableSurveys.filter((x) => x.id !== surveyId),
    );
    setSurveyToDelete(null);
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
        {viewableSurveys.length ? (
          <SurveysList
            surveys={viewableSurveys}
            actionsBuilder={(survey) => (
              <>
                <Button variant="contained" href={`/authoring/${survey.id}`}>
                  Edit Survey
                </Button>
                <Button
                  variant="outlined"
                  href={`/authoring/new?sourceSurveyId=${survey.id}`}
                >
                  Duplicate Survey
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setSurveyToDelete(survey.id)}
                >
                  Delete Survey
                </Button>
                <DeleteSurveyDialog
                  surveyId={survey.id}
                  title={survey.name}
                  open={openDeleteDialog}
                  onClose={() => handleSurveyDeletion(survey.id)}
                />
              </>
            )}
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
