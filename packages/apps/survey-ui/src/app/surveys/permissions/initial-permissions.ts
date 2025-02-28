import { v4 as uuidV4 } from "uuid";

import { SurveyPermissionDetails, SurveyPermissions } from "../types";

export function getInitialPermissions(
  surveyId: string | null,
): SurveyPermissions {
  return {
    id: uuidV4(),
    surveyId: surveyId ?? uuidV4(),
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
