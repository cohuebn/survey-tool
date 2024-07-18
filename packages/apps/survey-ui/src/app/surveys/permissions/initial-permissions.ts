import { v4 as uuidV4 } from "uuid";

import { SurveyPermissionDetails, SurveyPermissions } from "../types";

export function getInitialPermissions(surveyId: string): SurveyPermissions {
  return {
    id: uuidV4(),
    surveyId,
    isPublic: true,
    restrictByLocation: false,
    restrictByDepartment: false,
  };
}

export function getInitialPermissionDetails(
  surveyId: string,
): SurveyPermissionDetails {
  return {
    permissions: getInitialPermissions(surveyId),
    locationRestrictions: [],
    departmentRestrictions: [],
  };
}
