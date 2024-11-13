import { SurveySummary } from "../types";

import styles from "./styles.module.css";
import { SurveyCard } from "./survey-card";

type SurveysListProps = {
  surveys: SurveySummary[];
  actionsBuilder: (survey: SurveySummary) => React.ReactNode;
};

export function SurveysList({ surveys, actionsBuilder }: SurveysListProps) {
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
