import { SurveySummary } from "../types";

import { SurveyCard } from "./survey-card";
import styles from "./styles.module.css";

type SurveysListProps = {
  surveys: SurveySummary[];
};

export function SurveysList({ surveys }: SurveysListProps) {
  return (
    <div className={styles.surveysList}>
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </div>
  );
}
