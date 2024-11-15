import { isNullOrUndefined } from "@survey-tool/core";
import { useEffect, useState } from "react";

import { useAccessToken } from "../../users/use-access-token";
import { RatingStatsByLocationId } from "../types/overall-ratings";

async function fetchOverallRatingsByLocation(
  accessToken: string | null,
  surveyId: string,
): Promise<RatingStatsByLocationId> {
  if (isNullOrUndefined(accessToken)) {
    throw new Error(
      "No access token associated with session; can't fetch answers",
    );
  }
  const response = await fetch(
    `/api/surveys/${surveyId}/overall-ratings/by-location`,
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
  return response.json();
}

export function useOverallRatingsByLocation(surveyId: string) {
  const { accessToken, accessTokenLoaded } = useAccessToken();
  const [overallRatingsLoaded, setOverallRatingsLoaded] = useState(false);
  const [overallRatings, setOverallRatings] = useState<RatingStatsByLocationId>(
    {},
  );

  useEffect(() => {
    if (overallRatingsLoaded) return;
    if (!accessTokenLoaded) return;

    fetchOverallRatingsByLocation(accessToken, surveyId).then(
      (loadedRatingStats) => {
        setOverallRatings(loadedRatingStats);
        setOverallRatingsLoaded(true);
      },
    );
  }, [surveyId, overallRatingsLoaded, accessToken, accessTokenLoaded]);

  return { overallRatings, overallRatingsLoaded };
}
