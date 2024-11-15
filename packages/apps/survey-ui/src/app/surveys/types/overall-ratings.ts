export type SavableOverallRating = {
  participantId: string;
  surveyId: string;
  rating: number;
  ratingTime: Date;
};

export type OverallRating = SavableOverallRating & {
  id: string;
};
