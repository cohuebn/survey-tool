import { ReviewQuestionProps } from "../../types/survey-review";

import { AnswersPieChart } from "./answers-pie-chart";

export function renderQuestion(renderQuestionProps: ReviewQuestionProps) {
  return <AnswersPieChart {...renderQuestionProps} />;
}
