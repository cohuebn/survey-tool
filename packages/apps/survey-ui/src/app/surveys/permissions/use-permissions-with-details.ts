"use client";

import { useMemo } from "react";

import { SurveyPermissionDetails } from "../types";

import { useLocationRestrictions } from "./use-location-restrictions";
import { useSurveyPermissions } from "./use-permissions";
import { getInitialPermissions } from "./initial-permissions";
import { useDepartmentRestrictions } from "./use-department-restrictions";

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
  const { departmentRestrictions, departmentRestrictionsLoaded } =
    useDepartmentRestrictions(surveyId);
  const permissionDetailsLoaded = useMemo(
    () =>
      permissionsLoaded &&
      locationRestrictionsLoaded &&
      departmentRestrictionsLoaded,
    [
      permissionsLoaded,
      locationRestrictionsLoaded,
      departmentRestrictionsLoaded,
    ],
  );
  return {
    permissionDetailsLoaded,
    permissionDetails: {
      permissions: initialPermissions,
      locationRestrictions,
      departmentRestrictions,
    },
  };
}
