import { v4 as uuid } from "uuid";

import { Hospital } from "../../hospitals/types";
import { SurveyAllowedLocation } from "../types";

/** Convert a survey id and hospital into an allowed location object */
export function toSurveyAllowedLocation(
  surveyId: string,
  hospital: Hospital,
): SurveyAllowedLocation {
  return {
    id: uuid(),
    surveyId,
    locationId: hospital.id,
    location: hospital,
  };
}
