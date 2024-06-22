import { SnakeCasedPropertiesDeep } from "type-fest";

export type SurveySummary = {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  ownerId: string;
};

export type DBSurveySummary = SnakeCasedPropertiesDeep<SurveySummary>;
