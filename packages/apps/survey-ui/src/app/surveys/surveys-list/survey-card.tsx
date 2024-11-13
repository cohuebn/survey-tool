import { Card, CardActions, CardContent, Typography } from "@mui/material";

import { SurveySummary } from "../types";

import styles from "./styles.module.css";

type SurveyCardProps = {
  survey: SurveySummary;
  actions: React.ReactNode;
};

export function SurveyCard({ survey, actions }: SurveyCardProps) {
  return (
    <Card className={styles.surveyCard}>
      <CardContent>
        <Typography variant="body1" className={styles.surveyCardTitle}>
          {survey.name}
        </Typography>
        {survey.subtitle ? (
          <Typography variant="body1" className={styles.surveyCardSubtitle}>
            {survey.subtitle}
          </Typography>
        ) : null}
        {survey.description ? (
          <Typography variant="body1" className={styles.surveyCardDescription}>
            {survey.description}
          </Typography>
        ) : null}
      </CardContent>
      <CardActions>{actions}</CardActions>
    </Card>
  );
}
