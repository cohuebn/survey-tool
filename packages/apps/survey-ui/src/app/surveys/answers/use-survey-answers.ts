import { useEffect, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import { DBAnswerWithoutParticipant } from "../types";
import { useAccessToken } from "../../users/use-access-token";

export const revalidate = 60;

async function fetchSurveyAnswers(
  accessToken: string | null,
  surveyId: string,
): Promise<DBAnswerWithoutParticipant[]> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  const response = await fetch(`/api/surveys/${surveyId}/answers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const answers: DBAnswerWithoutParticipant[] = await response.json();
  return answers;
}

export function useSurveyAnswers(surveyId: string) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answers, setAnswers] = useState<DBAnswerWithoutParticipant[]>([]);

  useEffect(() => {
    if (answersLoaded) return;
    if (!accessTokenLoaded) return;

    fetchSurveyAnswers(accessToken, surveyId).then((loadedAnswers) => {
      setAnswers(loadedAnswers);
      setAnswersLoaded(true);
    });
  }, [surveyId, answersLoaded, accessToken, accessTokenLoaded]);

  return { answers, answersLoaded };
}
