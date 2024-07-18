import { v4 as uuid } from "uuid";

import { SurveyAllowedDepartment } from "../types";

/** Convert a survey id and department into an allowed department object */
export function toSurveyAllowedDepartment(
  surveyId: string,
  department: string,
): SurveyAllowedDepartment {
  return {
    id: uuid(),
    surveyId,
    department,
  };
}
