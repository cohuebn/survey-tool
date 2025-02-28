import { toHashedKey } from "@survey-tool/core";

export function getParticipantId(
  userId: string,
  roleId: string,
  surveyId: string,
) {
  return toHashedKey([userId, roleId, surveyId]);
}
