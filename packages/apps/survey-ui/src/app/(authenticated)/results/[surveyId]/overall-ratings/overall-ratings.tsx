import {
  Paper,
  Rating,
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

import styles from "./styles.module.css";

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
        This survey has not been taken by anyone yet
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h5">
        Overall ratings based on this survey&#39;s results
      </Typography>

      <TableContainer className={styles.ratingsTable} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell align="right">Average rating</TableCell>
              <TableCell align="right">Participant count</TableCell>
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
                  <TableCell align="right">
                    <Rating readOnly value={row.averageRating} />
                  </TableCell>
                  <TableCell align="right">{row.participantCount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
