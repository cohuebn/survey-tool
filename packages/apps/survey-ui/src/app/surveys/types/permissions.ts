import { SnakeCasedPropertiesDeep } from "type-fest";

import { Hospital } from "../../hospitals/types";

export type SurveyPermissions = {
  id: string;
  surveyId: string;
  isPublic: boolean;
  restrictByLocation: boolean;
  restrictByDepartment: boolean;
};

export type DBSurveyPermissions = SnakeCasedPropertiesDeep<SurveyPermissions>;

export type SurveyAllowedLocation = {
  id: string;
  surveyId: string;
  locationId: string;
  hospital: Hospital;
};

export type DBSurveyAllowedLocation =
  SnakeCasedPropertiesDeep<SurveyAllowedLocation>;
