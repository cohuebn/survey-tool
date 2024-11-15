import { RatingStats } from "../types/overall-ratings";

/** Round the value to the nearest half (0.5) */
function toNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/**
 * Round rating stats to the nearest half (0.5).
 * This allows displaying them in a more user-friendly way (e.g. stars)
 */
export function roundRatingStats<T extends RatingStats>(ratingStat: T): T {
  return {
    ...ratingStat,
    worstRating: toNearestHalf(ratingStat.worstRating),
    averageRating: toNearestHalf(ratingStat.averageRating),
    bestRating: toNearestHalf(ratingStat.bestRating),
  };
}
