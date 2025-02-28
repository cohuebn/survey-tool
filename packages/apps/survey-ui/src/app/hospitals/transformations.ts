import { toCamel } from "convert-keys";
import { CamelCasedPropertiesDeep } from "type-fest";
import { isNullOrUndefined } from "@survey-tool/core";

import { Hospital } from "./types";

type DbHospitalContainer = {
  location?: string;
  hospital_location?: string;
  hospital_name?: string;
  hospital_city?: string;
  hospital_state?: string;
};

/**
 * We often get db results containing hospital fields as part of the result set.
 * In the application, we want to treat that as a Hospital object.
 * This function converts the hospital fields off of a larger database result object into a Hospital object.
 * @param dbContainer The database result object containing hospital fields.
 * @returns The corresponding Hospital object.
 */
export function getHospitalFromDatabaseResult(
  dbContainer: DbHospitalContainer,
): Hospital | undefined {
  const {
    location,
    hospitalLocation,
    hospitalName,
    hospitalCity,
    hospitalState,
  } = toCamel<CamelCasedPropertiesDeep<DbHospitalContainer>>(dbContainer);
  const parsedLocation = location ?? hospitalLocation;
  if (
    isNullOrUndefined(parsedLocation) ||
    isNullOrUndefined(hospitalName) ||
    isNullOrUndefined(hospitalCity) ||
    isNullOrUndefined(hospitalState)
  ) {
    return undefined;
  }

  return {
    id: parsedLocation,
    name: hospitalName,
    city: hospitalCity,
    state: hospitalState,
  };
}
