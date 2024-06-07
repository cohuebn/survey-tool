import { User, UserProfile } from "./types";

export function convertUserToProfile(user: User): UserProfile {
  return {
    userId: user.userId,
    validatedTimestamp: user.validatedTimestamp,
    location: user.location,
    department: user.department,
    employmentType: user.employmentType,
  };
}
