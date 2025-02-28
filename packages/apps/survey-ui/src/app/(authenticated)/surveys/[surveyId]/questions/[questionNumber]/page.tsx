"use client";

import { Alert, CircularProgress } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useState } from "react";

import { useUserId } from "../../../../../auth/use-user-id";
import { useQuestions, useSurveySummary } from "../../../../../surveys";
import { SurveyTaker } from "../../../../../surveys/survey-taker/survey-taker";
import { useCurrentUserSurveyAnswers } from "../../../../../surveys/answers/use-participant-survey-answers";
import { useSurveyTakingPermission } from "../../../../../surveys/survey-taker/use-survey-taking-permission";
import { usePhysicianRoles } from "../../../../../users/use-physician-roles";
import { PhysicianRole } from "../../../../../users/types";
import { PhysicianRoleSelection } from "../../../../../surveys/survey-taker/physician-role-selection/physician-role-selection";

type PageProps = {
  params: { surveyId: string; questionNumber: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveySummary } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { surveyTakingPermission, surveyTakingPermissionLoaded } =
    useSurveyTakingPermission(surveyId);
  const { physicianRoles, physicianRolesLoaded } = usePhysicianRoles(userId);
  const [selectedRole, setSelectedRole] = useState<PhysicianRole | null>(null);
  const { answers, answersLoaded } = useCurrentUserSurveyAnswers(
    surveyId,
    selectedRole,
  );

  if (
    !userId ||
    !surveySummary ||
    !questionsLoaded ||
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

  if (!selectedRole && physicianRoles.length === 1) {
    setSelectedRole(physicianRoles[0]);
  } else if (!selectedRole) {
    return (
      <div className={layoutStyles.centeredContent}>
        <PhysicianRoleSelection
          physicianRoles={physicianRoles}
          onChange={(role) => setSelectedRole(role)}
        />
      </div>
    );
  }

  if (!answersLoaded) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <SurveyTaker
        userId={userId}
        selectedRole={selectedRole}
        surveyId={surveySummary?.id}
        summary={surveySummary}
        questions={questions}
        answers={answers}
        initialQuestionNumber={parseInt(params.questionNumber, 10)}
      />
    </div>
  );
}
