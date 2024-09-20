export const employmentTypeOptions = ["Private practice", "Hospital"] as const;
export type EmploymentType = (typeof employmentTypeOptions)[number];
