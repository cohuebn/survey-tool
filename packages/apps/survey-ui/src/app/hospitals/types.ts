import { SnakeCasedProperties } from "type-fest";

export type Hospital = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export type DBHospital = SnakeCasedProperties<Hospital>;
