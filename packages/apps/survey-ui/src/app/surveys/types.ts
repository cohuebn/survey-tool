import { SnakeCasedPropertiesDeep } from "type-fest";

export type Survey = {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  ownerId: string;
};

export type DBSurvey = SnakeCasedPropertiesDeep<Survey>;

export type SurveyFilters = {
  ownerId?: string;
};
