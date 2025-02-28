import { useEffect, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import { AnswersForQuestions } from "../types";
import { useAccessToken } from "../../users/use-access-token";
import { PhysicianRole } from "../../users/types";

async function fetchSurveyAnswers(
  accessToken: string | null,
  surveyId: string,
  roleId: string,
): Promise<AnswersForQuestions> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  if (isNullOrUndefined(roleId)) {
    throw new Error("No role ID provided; can't fetch answers");
  }
  const response = await fetch(
    `/api/surveys/${surveyId}/answers/user?roleId=${roleId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const answers: AnswersForQuestions = await response.json();
  return answers;
}

export function useCurrentUserSurveyAnswers(
  surveyId: string,
  role: PhysicianRole | null,
) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answers, setAnswers] = useState<AnswersForQuestions>({});

  useEffect(() => {
    setAnswersLoaded(false);
  }, [surveyId, role?.id]);

  useEffect(() => {
    if (answersLoaded) return;
    if (!accessTokenLoaded || isNullOrUndefined(role)) return;

    fetchSurveyAnswers(accessToken, surveyId, role.id).then((loadedAnswers) => {
      setAnswers(loadedAnswers);
      setAnswersLoaded(true);
    });
  }, [surveyId, answersLoaded, accessToken, accessTokenLoaded, role]);

  return { answers, answersLoaded };
}
