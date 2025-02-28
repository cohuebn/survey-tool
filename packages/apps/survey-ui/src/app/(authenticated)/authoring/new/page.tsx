"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { v4 as uuidV4 } from "uuid";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { isNotNullOrUndefined } from "@survey-tool/core";

import {
  EditableQuestion,
  EditableSummary,
  SurveyEditor,
  SurveyEditorState,
  SurveyPermissionDetails,
} from "../../../surveys";
import { useUserId } from "../../../auth/use-user-id";
import { getInitialPermissionDetails } from "../../../surveys/permissions/initial-permissions";
import { useSurveyState } from "../use-survey-state";

function getNewSurveyState(ownerId: string): SurveyEditorState {
  const surveyId = uuidV4();
  return {
    surveyId,
    summary: { id: surveyId, ownerId },
    questions: [],
    deletedQuestionIds: [],
    permissions: getInitialPermissionDetails(surveyId),
    deletedLocationRestrictionIds: [],
    deletedDepartmentRestrictionIds: [],
  };
}

function getDuplicatedSurveyState(
  existingSurveyState: SurveyEditorState,
): SurveyEditorState {
  const surveyId = uuidV4();
  const duplicatedSummary: EditableSummary = {
    ...existingSurveyState.summary,
    id: surveyId,
  };
  const duplicatedQuestions: EditableQuestion[] =
    existingSurveyState.questions.map((question) => {
      return { ...question, id: uuidV4(), surveyId };
    });
  const duplicatedPermissions: SurveyPermissionDetails = {
    permissions: {
      ...existingSurveyState.permissions.permissions,
      id: uuidV4(),
      surveyId,
    },
    locationRestrictions:
      existingSurveyState.permissions.locationRestrictions.map(
        (locationRestriction) => {
          return { ...locationRestriction, id: uuidV4(), surveyId };
        },
      ),
    departmentRestrictions:
      existingSurveyState.permissions.departmentRestrictions.map(
        (departmentRestriction) => {
          return { ...departmentRestriction, id: uuidV4(), surveyId };
        },
      ),
  };
  return {
    surveyId,
    summary: duplicatedSummary,
    questions: duplicatedQuestions,
    permissions: duplicatedPermissions,
    deletedQuestionIds: [],
    deletedLocationRestrictionIds: [],
    deletedDepartmentRestrictionIds: [],
  };
}

export default function Page() {
  const userId = useUserId();
  const queryStringParams = useSearchParams();
  const sourceSurveyId = queryStringParams.get("sourceSurveyId");
  const { surveyState: existingSurveyState, surveyStateLoaded } =
    useSurveyState(sourceSurveyId);
  const initialSurveyState: SurveyEditorState = useMemo(() => {
    return sourceSurveyId && isNotNullOrUndefined(existingSurveyState)
      ? getDuplicatedSurveyState(existingSurveyState)
      : getNewSurveyState(userId || "no owner");
  }, [existingSurveyState, sourceSurveyId, userId]);

  if (!userId || !surveyStateLoaded) {
    return <CircularProgress />;
  }

  if (!initialSurveyState) {
    throw new Error(`Failed to setup initial survey state for user ${userId}`);
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Create a new survey</Typography>
      <SurveyEditor
        initialEditorState={initialSurveyState}
        isNewSurvey={true}
      />
    </div>
  );
}
