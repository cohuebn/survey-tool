import { Typography } from "@mui/material";

import { QuestionProps } from "./types";

export function FreeFormQuestion({ question }: QuestionProps) {
  return <Typography variant="body1">{question.question}</Typography>;
}
