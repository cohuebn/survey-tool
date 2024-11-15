"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useMemo } from "react";

import { useSurveySummary } from "../../../../surveys";
import { useParticipatingHospitals } from "../../../../surveys/answers/use-participating-hospitals";
import { useOverallRatingsByLocation } from "../../../../surveys/overall-ratings/use-overall-ratings-by-location";
import { RatingStatsWithLocation } from "../../../../surveys/types/overall-ratings";
import { withLocationData } from "../../../../surveys/overall-ratings/with-location-data";

import { OverallRatings } from "./overall-ratings";

type PageProps = {
  params: { surveyId: string; questionNumber: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const { surveySummary } = useSurveySummary(surveyId);
  const { overallRatings, overallRatingsLoaded } =
    useOverallRatingsByLocation(surveyId);
  const { participatingHospitalsLoaded, participatingHospitals } =
    useParticipatingHospitals(surveyId);

  const hospitals = participatingHospitals.map((x) => x.hospital);
  const ratingStatsWithLocations: RatingStatsWithLocation[] = useMemo(() => {
    const ratingsWithLocationData =
      Object.keys(overallRatings).length && hospitals.length
        ? withLocationData(overallRatings, hospitals)
        : {};
    return Object.values(ratingsWithLocationData);
  }, [overallRatings, hospitals]);

  if (
    !surveySummary ||
    !overallRatingsLoaded ||
    !participatingHospitalsLoaded
  ) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">{surveySummary.name}</Typography>
      <OverallRatings ratingStats={ratingStatsWithLocations} />
    </div>
  );
}
