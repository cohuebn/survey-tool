import { SnakeCasedPropertiesDeep } from "type-fest";

export type SurveyPermissions = {
  id: string;
  surveyId: string;
  isPublic: boolean;
  restrictByLocation: boolean;
  restrictByDepartment: boolean;
};

export type DBSurveyPermissions = SnakeCasedPropertiesDeep<SurveyPermissions>;
