import { Hospital } from "../../hospitals/types";

export type SavableOverallRating = {
  participantId: string;
  surveyId: string;
  rating: number;
  ratingTime: Date;
  location?: string;
  department?: string;
  employmentType?: string;
};

export type OverallRating = SavableOverallRating & {
  id: string;
};

export type RatingStats = {
  participantCount: number;
  worstRating: number;
  averageRating: number;
  bestRating: number;
};
export type RatingStatsWithLocation = RatingStats & {
  location: Hospital;
};

export type RatingStatsByLocationId = Record<string, RatingStats>;
export type RatingStatsWithLocationByLocationId = Record<
  string,
  RatingStatsWithLocation
>;
