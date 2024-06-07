import { SnakeCasedPropertiesDeep } from "type-fest";

import { DBHospital, Hospital } from "../hospitals/types";

export type UserProfile = {
  userId: string;
  validatedTimestamp?: Date;
  location?: string;
  department?: string;
  employmentType?: string;
};

export type DBUserProfile = SnakeCasedPropertiesDeep<UserProfile>;

export type User = UserProfile & {
  hospitals?: Hospital;
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

export type UserValidation = {
  userId: string;
  submittedTimestamp: Date;
  deniedTimestamp?: Date;
  emailAddress: string;
  npiNumber?: string;
};

export type DBUserValidation = SnakeCasedPropertiesDeep<UserValidation>;

export type UnvalidatedUser = User & { userValidation: UserValidation };

export type DBUnvalidatedUser = SnakeCasedPropertiesDeep<UnvalidatedUser>;
