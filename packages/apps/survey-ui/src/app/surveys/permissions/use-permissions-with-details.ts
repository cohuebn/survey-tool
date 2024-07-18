"use client";

import { useMemo } from "react";

import { SurveyPermissionDetails } from "../types";

import { useLocationRestrictions } from "./use-location-restrictions";
import { useSurveyPermissions } from "./use-permissions";
import { getInitialPermissions } from "./initial-permissions";

type UseSurveyPermissionsWithDetailsResults = {
  permissionDetailsLoaded: boolean;
  permissionDetails: SurveyPermissionDetails;
};

export function useSurveyPermissionsWithDetails(
  surveyId: string,
): UseSurveyPermissionsWithDetailsResults {
  const { permissions, permissionsLoaded } = useSurveyPermissions(surveyId);
  const initialPermissions = useMemo(() => {
    return permissions ?? getInitialPermissions(surveyId);
  }, [permissions, surveyId]);
  const { locationRestrictions, locationRestrictionsLoaded } =
    useLocationRestrictions(surveyId);
  const permissionDetailsLoaded = useMemo(
    () => permissionsLoaded && locationRestrictionsLoaded,
    [permissionsLoaded, locationRestrictionsLoaded],
  );
  return {
    permissionDetailsLoaded,
    permissionDetails: {
      permissions: initialPermissions,
      locationRestrictions,
    },
  };
}
