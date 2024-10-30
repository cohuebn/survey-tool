import { Typography } from "@mui/material";
import { useMemo } from "react";

import { AggregatedAnswerForQuestion, Question } from "../../types";
import styles from "../styles.module.css";
import { useChartCanvas } from "../../../core-components/use-chart-canvas";

type AnswersPieChartProps = {
  question: Question;
  answers: AggregatedAnswerForQuestion[];
};

export function AnswersPieChart({ question, answers }: AnswersPieChartProps) {
  const pieChartConfig = useMemo(() => {
    return {
      type: "doughnut" as const,
      data: {
        labels: answers.map((answer) => answer.answer),
        datasets: [
          {
            data: answers.map((x) => x.answerCount),
          },
        ],
      },
    };
  }, [answers]);

  const chartCanvas = useChartCanvas({
    config: pieChartConfig,
    height: "300px",
  });

  return (
    <div>
      <Typography variant="body1" className={styles.question}>
        Question: {question.question}
      </Typography>
      {chartCanvas}
    </div>
  );
}
