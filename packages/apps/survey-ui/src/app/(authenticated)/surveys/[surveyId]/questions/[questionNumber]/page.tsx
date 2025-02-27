"use client";

import { Alert, CircularProgress } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";

import { useUserId } from "../../../../../auth/use-user-id";
import { useQuestions, useSurveySummary } from "../../../../../surveys";
import { SurveyTaker } from "../../../../../surveys/survey-taker/survey-taker";
import { useCurrentUserSurveyAnswers } from "../../../../../surveys/answers/use-participant-survey-answers";
import { useSurveyTakingPermission } from "../../../../../surveys/survey-taker/use-survey-taking-permission";
import { usePhysicianRoles } from "../../../../../users/use-physician-roles";

type PageProps = {
  params: { surveyId: string; questionNumber: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { answers, answersLoaded } = useCurrentUserSurveyAnswers(surveyId);
  const { physicianRoles, physicianRolesLoaded } = usePhysicianRoles(userId);
  const { surveyTakingPermission, surveyTakingPermissionLoaded } =
    useSurveyTakingPermission(surveyId);

  if (
    !userId ||
    !surveySummary ||
    !questionsLoaded ||
    !answersLoaded ||
    !surveyTakingPermissionLoaded ||
    !physicianRolesLoaded
  ) {
    return <CircularProgress />;
  }

  if (!surveyTakingPermission) {
    return (
      <Alert severity="error">
        You do not have permission to take this survey.
      </Alert>
    );
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <SurveyTaker
        userId={userId}
        physicianRoles={physicianRoles}
        surveyId={surveySummary?.id}
        summary={surveySummary}
        questions={questions}
        answers={answers}
        initialQuestionNumber={parseInt(params.questionNumber, 10)}
      />
    </div>
  );
}
