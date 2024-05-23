import { DBHospital, Hospital } from "../hospitals/types";

export type User = {
  userId: string;
  validatedTimestamp?: Date;
  location?: string;
  hospitals?: Hospital;
  department?: string;
  employmentType?: string;
};

export type DBUser = {
  user_id: string;
  validated_timestamp?: Date;
  location?: string;
  hospitals?: DBHospital;
  location_name?: string;
  department?: string;
  employment_type?: string;
};
