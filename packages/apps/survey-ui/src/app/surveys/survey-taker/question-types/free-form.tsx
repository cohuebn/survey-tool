import { Typography } from "@mui/material";

import { QuestionProps } from "../../types/survey-taking";

export function FreeFormQuestion({ question }: QuestionProps) {
  return <Typography variant="body1">{question.question}</Typography>;
}
