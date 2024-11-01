import { isNullOrUndefined } from "@survey-tool/core";
import { useEffect, useState } from "react";

import { AggregatedAnswerWithLocationForQuestion } from "../types";
import { useAccessToken } from "../../users/use-access-token";

async function fetchAggregatedSurveyAnswers(
  accessToken: string | null,
  surveyId: string,
): Promise<AggregatedAnswerWithLocationForQuestion[]> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  const response = await fetch(`/api/surveys/${surveyId}/answers/aggregated`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

export function useAggregatedSurveyAnswers(surveyId: string) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answers, setAnswers] = useState<
    AggregatedAnswerWithLocationForQuestion[]
  >([]);

  useEffect(() => {
    if (answersLoaded) return;
    if (!accessTokenLoaded) return;

    fetchAggregatedSurveyAnswers(accessToken, surveyId).then(
      (loadedAnswers) => {
        setAnswers(loadedAnswers);
        setAnswersLoaded(true);
      },
    );
  }, [surveyId, answersLoaded, accessToken, accessTokenLoaded]);

  return { answers, answersLoaded };
}
