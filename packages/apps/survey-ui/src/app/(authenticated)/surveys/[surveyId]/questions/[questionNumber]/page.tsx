"use client";

import { CircularProgress } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";

import { useUserId } from "../../../../../auth/use-user-id";
import { useQuestions, useSurveySummary } from "../../../../../surveys";
import { SurveyTaker } from "../../../../../surveys/survey-taker/survey-taker";
import { useCurrentUserSurveyAnswers } from "../../../../../surveys/answers/use-participant-survey-answers";

type PageProps = {
  params: { surveyId: string; questionNumber: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { answers, answersLoaded } = useCurrentUserSurveyAnswers(surveyId);

  if (!userId || !surveySummary || !questionsLoaded || !answersLoaded) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <SurveyTaker
        userId={userId}
        surveyId={surveySummary?.id}
        summary={surveySummary}
        questions={questions}
        answers={answers}
        initialQuestionNumber={parseInt(params.questionNumber, 10)}
      />
    </div>
  );
}
