"use client";

import { useEffect, useState } from "react";
import { isNullOrUndefined } from "@survey-tool/core";

import { SurveySummary } from "../types";
import { useAccessToken } from "../../users/use-access-token";

export const revalidate = 60;

type UseSurveySummariesOptions = {
  authoring?: boolean;
  reviewing?: boolean;
};

async function fetchSurveySummaries(
  accessToken: string | null,
  options: UseSurveySummariesOptions,
): Promise<SurveySummary[]> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  const authoring = options.authoring ?? false;
  const response = await fetch(
    `/api/surveys/summaries?authoring=${authoring}&reviewing=${options.reviewing}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.json();
}

export function useSurveySummaries(options: UseSurveySummariesOptions = {}) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [surveySummariesLoaded, setSurveySummariesLoaded] = useState(false);
  const [surveySummaries, setSurveySummaries] = useState<SurveySummary[]>([]);

  useEffect(() => {
    if (surveySummariesLoaded) return;
    if (!accessTokenLoaded) return;

    fetchSurveySummaries(accessToken, options).then((loadedSurveys) => {
      setSurveySummaries(loadedSurveys);
      setSurveySummariesLoaded(true);
    });
  }, [surveySummariesLoaded, accessTokenLoaded, accessToken, options]);

  return { surveySummaries, surveySummariesLoaded };
}
