import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { PersonOff } from "@mui/icons-material";
import { useMemo } from "react";

import { RatingStatsWithLocation } from "../../../../surveys/types/overall-ratings";
import { roundRatingStats } from "../../../../surveys/overall-ratings/rating-stat-rounding";

type OverallRatingsProps = {
  ratingStats: RatingStatsWithLocation[];
};

export function OverallRatings({ ratingStats }: OverallRatingsProps) {
  const displayRatingStats: RatingStatsWithLocation[] = useMemo(
    () => ratingStats.map(roundRatingStats),
    [ratingStats],
  );

  if (!displayRatingStats.length) {
    return (
      <Typography
        variant="body1"
        className={layoutStyles.verticallyCenteredContent}
      >
        <PersonOff />
        No surveys have been completed yet
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h5">
        Overall ratings based on this survey&#39;s results
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell align="right">Participant count</TableCell>
              <TableCell align="right">Average rating</TableCell>
              <TableCell align="right">Worst rating</TableCell>
              <TableCell align="right">Best rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRatingStats.map((row) => {
              return (
                <TableRow
                  key={row.location.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.location.name}
                  </TableCell>
                  <TableCell align="right">{row.participantCount}</TableCell>
                  <TableCell align="right">{row.averageRating}</TableCell>
                  <TableCell align="right">{row.worstRating}</TableCell>
                  <TableCell align="right">{row.bestRating}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
