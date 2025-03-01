import { getServerSideSupabaseClient } from "../../../../../supabase/supbase-server-side-client";
import { getOverallRatingsForSurvey } from "../../../../../surveys/overall-ratings/database";
import {
  OverallRating,
  RatingStats,
  RatingStatsByLocationId,
} from "../../../../../surveys/types/overall-ratings";
import { mean } from "../../../../../utils/averages";

type PathParams = {
  surveyId: string;
};

function toRatingStats(ratings: OverallRating[]): RatingStats {
  const participantCount = ratings.length;
  const ratingsArray = ratings.map((rating) => rating.rating);
  return {
    participantCount,
    worstRating: Math.min(...ratingsArray),
    averageRating: mean(ratingsArray),
    bestRating: Math.max(...ratingsArray),
  };
}

export const revalidate = 60;

export async function GET(_: Request, { params }: { params: PathParams }) {
  const { surveyId } = params;
  const supabaseClient = await getServerSideSupabaseClient();
  const overallRatings = await getOverallRatingsForSurvey(
    supabaseClient(),
    surveyId,
  );

  const ratingsByLocation = overallRatings.reduce<
    Record<string, OverallRating[]>
  >((_ratingsByLocation, rating) => {
    const location = rating.location || "Location unknown";
    const existingRatings = _ratingsByLocation[location] ?? [];
    return {
      ..._ratingsByLocation,
      [location]: existingRatings.concat(rating),
    };
  }, {});

  const ratingStats = Object.entries(
    ratingsByLocation,
  ).reduce<RatingStatsByLocationId>((_ratingStats, [location, ratings]) => {
    return { ..._ratingStats, [location]: toRatingStats(ratings) };
  }, {});
  return Response.json(ratingStats);
}
