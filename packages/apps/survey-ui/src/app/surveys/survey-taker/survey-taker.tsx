"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import layoutStyles from "@styles/layout.module.css";
import { Pagination, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";

import { Question, SurveySummary } from "../types";

import styles from "./styles.module.css";

type SurveyTakerProps = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  initialQuestionNumber: number;
};

export function SurveyTaker({
  surveyId,
  summary,
  questions,
  initialQuestionNumber,
}: SurveyTakerProps) {
  const router = useRouter();
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(
    initialQuestionNumber,
  );
  const activeQuestion = questions[activeQuestionNumber - 1];

  const handleQuestionChange = (questionNumber: number) => {
    setActiveQuestionNumber(questionNumber);
    router.push(`/surveys/${surveyId}/questions/${questionNumber}`);
  };

  return (
    <div className={clsx(layoutStyles.centeredContent)}>
      <Typography className={styles.surveyTitle} variant="h2">
        {summary.name}
      </Typography>
      <Typography variant="body1">{activeQuestion.question}</Typography>
      <div className={styles.questionsNavigation}>
        <Pagination
          count={questions.length}
          page={activeQuestionNumber}
          color="primary"
          onChange={(_: ChangeEvent<unknown>, questionNumber: number) =>
            handleQuestionChange(questionNumber)
          }
        />
      </div>
    </div>
  );
}
