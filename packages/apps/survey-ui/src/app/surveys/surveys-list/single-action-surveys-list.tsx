import { useCallback } from "react";
import { Button } from "@mui/material";

import { SurveySummary } from "../types";

import styles from "./styles.module.css";
import { SurveyCard } from "./survey-card";

type SurveysListProps = {
  surveys: SurveySummary[];
  linkText: string;
  linkBuilder: (surveyId: string) => string;
};

export function SingleActionSurveysList({
  surveys,
  linkText,
  linkBuilder,
}: SurveysListProps) {
  const actionsBuilder = useCallback(
    (survey: SurveySummary) => {
      return (
        <Button variant="contained" href={linkBuilder(survey.id)}>
          {linkText}
        </Button>
      );
    },
    [linkText, linkBuilder],
  );
  return (
    <div className={styles.surveysList}>
      {surveys.map((survey) => (
        <SurveyCard
          key={survey.id}
          survey={survey}
          actions={actionsBuilder(survey)}
        />
      ))}
    </div>
  );
}
