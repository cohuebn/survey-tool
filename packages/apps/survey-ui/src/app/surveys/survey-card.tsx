import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import { SurveySummary } from "./types";

type SurveyCardProps = {
  survey: SurveySummary;
};

export function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{survey.name}</Typography>
        {survey.subtitle ? (
          <Typography variant="caption">{survey.subtitle}</Typography>
        ) : null}
        {survey.description ? (
          <Typography variant="body1">{survey.description}</Typography>
        ) : null}
      </CardContent>
      <CardActions>
        <Button href={`/authoring/${survey.id}`}>Author survey</Button>
      </CardActions>
    </Card>
  );
}
