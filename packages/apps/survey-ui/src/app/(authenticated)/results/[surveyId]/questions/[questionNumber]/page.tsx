"use client";

import { CircularProgress } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";

import { useAggregatedSurveyAnswers } from "../../../../../surveys/answers/use-aggregated-survey-answers";
import { useQuestions, useSurveySummary } from "../../../../../surveys";
import { SurveyReviewer } from "../../../../../surveys/survey-reviewer/survey-reviewer";
import { useParticipatingHospitals } from "../../../../../surveys/answers/use-participating-hospitals";

type PageProps = {
  params: { surveyId: string; questionNumber: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId, questionNumber } = params;
  const { surveySummary } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { answers, answersLoaded } = useAggregatedSurveyAnswers(surveyId);
  const { participatingHospitals, participatingHospitalsLoaded } =
    useParticipatingHospitals(surveyId);

  if (
    !surveySummary ||
    !questionsLoaded ||
    !answersLoaded ||
    !participatingHospitalsLoaded
  ) {
    return <CircularProgress />;
  }
  return (
    <div className={layoutStyles.centeredContent}>
      <SurveyReviewer
        surveyId={surveyId}
        summary={surveySummary}
        questions={questions}
        allAnswers={answers}
        participatingHospitals={participatingHospitals}
        initialQuestionNumber={parseInt(questionNumber, 10)}
      />
    </div>
  );
}
