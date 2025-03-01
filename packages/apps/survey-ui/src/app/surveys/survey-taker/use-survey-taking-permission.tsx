"use client";

import { useEffect, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import { useAccessToken } from "../../users/use-access-token";

export const revalidate = 60;

async function fetchSurveyTakingPermission(
  accessToken: string | null,
  surveyId: string,
): Promise<boolean> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  const response = await fetch(`/api/surveys/${surveyId}/permission`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { userHasPermission } = await response.json();
  return userHasPermission;
}

export function useSurveyTakingPermission(surveyId: string) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [surveyTakingPermissionLoaded, setSurveyTakingPermissionLoaded] =
    useState(false);
  const [surveyTakingPermission, setSurveyTakingPermission] =
    useState<boolean>(false);

  useEffect(() => {
    if (surveyTakingPermissionLoaded) return;
    if (!accessTokenLoaded) return;

    fetchSurveyTakingPermission(accessToken, surveyId).then(
      (loadedSurveyTakingPermission) => {
        setSurveyTakingPermission(loadedSurveyTakingPermission);
        setSurveyTakingPermissionLoaded(true);
      },
    );
  }, [surveyTakingPermissionLoaded, accessTokenLoaded, accessToken, surveyId]);

  return { surveyTakingPermission, surveyTakingPermissionLoaded };
}
