import { isNullOrUndefined } from "@survey-tool/core";

import { Hospital } from "../../hospitals/types";
import {
  RatingStats,
  RatingStatsByLocationId,
  RatingStatsWithLocation,
  RatingStatsWithLocationByLocationId,
} from "../types/overall-ratings";

function getRatingWithLocationData(
  locationId: string,
  ratingStats: RatingStats,
  hospitals: Hospital[],
): RatingStatsWithLocation {
  const location = hospitals.find((x) => x.id === locationId);
  if (isNullOrUndefined(location)) {
    throw new Error(
      `Location with ID ${locationId} not found in hospitals list`,
    );
  }

  return { ...ratingStats, location };
}

/** Add hospital (location) data to all of the rating stats provided */
export function withLocationData(
  ratingStatsByLocationId: RatingStatsByLocationId,
  hospitals: Hospital[],
): RatingStatsWithLocationByLocationId {
  return Object.entries(
    ratingStatsByLocationId,
  ).reduce<RatingStatsWithLocationByLocationId>(
    (ratingStatsWithLocationByLocationId, [locationId, ratingStats]) => {
      const ratingStatsWithLocation = getRatingWithLocationData(
        locationId,
        ratingStats,
        hospitals,
      );

      return {
        ...ratingStatsWithLocationByLocationId,
        [locationId]: ratingStatsWithLocation,
      };
    },
    {},
  );
}
