"use client";

import { useEffect, useMemo, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import {
  Question,
  SurveyEditorState,
  SurveyPermissionDetails,
  SurveySummary,
  useQuestions,
  useSurveySummary,
} from "../../surveys";
import { useSurveyPermissionsWithDetails } from "../../surveys/permissions/use-permissions-with-details";

function getExistingSurveyState(
  summary: SurveySummary,
  questions: Question[],
  permissions: SurveyPermissionDetails,
): SurveyEditorState {
  return {
    surveyId: summary.id,
    summary,
    questions,
    deletedQuestionIds: [],
    permissions,
    deletedLocationRestrictionIds: [],
    deletedDepartmentRestrictionIds: [],
  };
}

export function useSurveyState(surveyId: string | null) {
  const { surveySummary, surveySummaryLoaded } = useSurveySummary(surveyId);
  const { questions, questionsLoaded } = useQuestions(surveyId);
  const { permissionDetails, permissionDetailsLoaded } =
    useSurveyPermissionsWithDetails(surveyId);
  const [surveyStateLoaded, setSurveyStateLoaded] = useState(false);
  const [surveyState, setSurveyState] = useState<SurveyEditorState | null>(
    null,
  );
  const allComponentsLoaded = useMemo(() => {
    return [
      surveySummaryLoaded,
      questionsLoaded,
      permissionDetailsLoaded,
    ].every((loaded) => loaded);
  }, [surveySummaryLoaded, questionsLoaded, permissionDetailsLoaded]);

  // Triggers refresh on changes to any of the loaded components
  useEffect(() => {
    if (!allComponentsLoaded && surveyStateLoaded) {
      setSurveyStateLoaded(false);
    }
  }, [allComponentsLoaded, surveyStateLoaded]);

  useEffect(() => {
    if (isNullOrUndefined(surveyId)) {
      setSurveyState(null);
      setSurveyStateLoaded(true);
      return;
    }
    if (surveyStateLoaded) return;
    if (!allComponentsLoaded) return;

    if (surveySummary) {
      setSurveyState(
        getExistingSurveyState(surveySummary, questions, permissionDetails),
      );
      setSurveyStateLoaded(true);
    }
  }, [
    surveySummary,
    questions,
    permissionDetails,
    surveyStateLoaded,
    allComponentsLoaded,
    surveyId,
  ]);

  return { surveyState, surveyStateLoaded };
}
