import { SurveySummary } from "./types";
import { SurveyCard } from "./survey-card";

type SurveysListProps = {
  surveys: SurveySummary[];
};

export function SurveysList({ surveys }: SurveysListProps) {
  return (
    <>
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </>
  );
}
