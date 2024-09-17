import { toHashedKey } from "@survey-tool/core";

export function getParticipantId(userId: string, surveyId: string) {
  return toHashedKey([userId, surveyId]);
}
