import { Survey } from "./types";
import { SurveyCard } from "./survey-card";

type SurveysListProps = {
  surveys: Survey[];
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
