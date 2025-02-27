import { SnakeCasedPropertiesDeep } from "type-fest";

import { Hospital } from "../hospitals/types";

export type UserProfile = {
  userId: string;
  validatedTimestamp?: Date;
};

export type DBUserProfile = SnakeCasedPropertiesDeep<UserProfile>;

export type DBUser = {
  user_id: string;
  validated_timestamp?: Date;
};

export type UserValidation = {
  userId: string;
  submittedTimestamp: Date;
  emailAddress: string;
  npiNumber?: string;
  deniedTimestamp?: Date;
  deniedReason?: string;
};

export type DBUserValidation = SnakeCasedPropertiesDeep<UserValidation>;

export type UserWithValidationData = UserProfile & {
  hospital: Hospital | undefined;
  department: string | undefined;
  employmentType: string | undefined;
  userValidation: UserValidation;
};

export type DBUserWithValidationData =
  SnakeCasedPropertiesDeep<UserWithValidationData>;

export type DBDeniedUser = {
  user_id: string;
  submitted_timestamp: Date;
  npi_number: string;
  email_address: string;
  denied_timestamp: Date;
  denied_reason?: string;
  hospital_location?: string;
  hospital_name?: string;
  hospital_city?: string;
  hospital_state?: string;
  department?: string;
  employment_type?: string;
};

export type DBPhysicianRole = {
  id: string;
  user_id: string;
  hospital_location?: string;
  hospital_name?: string;
  hospital_city?: string;
  hospital_state?: string;
  department?: string;
  employment_type?: string;
  created_timestamp: Date;
  validated_timestamp?: Date;
};

export type SavableDBPhysicianRole = {
  id: string;
  user_id: string;
  location: string;
  department: string;
  employment_type: string;
  created_timestamp: Date;
  validated_timestamp?: Date;
};

export type PhysicianRole = {
  id: string;
  userId: string;
  hospital?: Hospital;
  department?: string;
  employmentType?: string;
  createdTimestamp: Date;
  validatedTimestamp?: Date;
};
