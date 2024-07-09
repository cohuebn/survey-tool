import { v4 as uuidV4 } from "uuid";

import { EditableQuestion } from "../types";

export function createNewEditableQuestion(
  surveyId: string,
  sortOrder: number,
): EditableQuestion {
  return {
    id: uuidV4(),
    surveyId,
    sortOrder,
    definition: {},
  };
}
