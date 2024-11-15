import { useEffect, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import { AnswersForQuestions } from "../types";
import { useAccessToken } from "../../users/use-access-token";

async function fetchSurveyAnswers(
  accessToken: string | null,
  surveyId: string,
): Promise<AnswersForQuestions> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  const response = await fetch(`/api/surveys/${surveyId}/answers/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const answers: AnswersForQuestions = await response.json();
  return answers;
}

export function useCurrentUserSurveyAnswers(surveyId: string) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answers, setAnswers] = useState<AnswersForQuestions>({});

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
