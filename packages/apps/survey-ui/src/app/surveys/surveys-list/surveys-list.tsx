import { SurveySummary } from "../types";

import { SurveyCard } from "./survey-card";
import styles from "./styles.module.css";

type SurveysListProps = {
  surveys: SurveySummary[];
  linkText: string;
  linkBuilder: (surveyId: string) => string;
};

export function SurveysList({
  surveys,
  linkText,
  linkBuilder,
}: SurveysListProps) {
  return (
    <div className={styles.surveysList}>
      {surveys.map((survey) => (
        <SurveyCard
          key={survey.id}
          survey={survey}
          linkText={linkText}
          linkBuilder={linkBuilder}
        />
      ))}
    </div>
  );
}
