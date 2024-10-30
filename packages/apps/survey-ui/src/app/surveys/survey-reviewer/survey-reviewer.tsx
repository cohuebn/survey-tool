import { ChangeEvent, useReducer, useState } from "react";
import { Autocomplete, Pagination, TextField, Typography } from "@mui/material";

import {
  AggregatedAnswersForQuestions,
  ParticipatingHospital,
  Question,
  SurveySummary,
} from "../types";

import { surveyReviewerReducer } from "./survey-reviewer-reducer";
import styles from "./styles.module.css";
import { renderQuestion } from "./question-review";

type SurveyReviewerProps = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  answers: AggregatedAnswersForQuestions;
  initialQuestionNumber: number;
  participatingHospitals: ParticipatingHospital[];
};

export function SurveyReviewer({
  surveyId,
  summary,
  questions,
  answers,
  initialQuestionNumber,
  participatingHospitals,
}: SurveyReviewerProps) {
  const activeQuestion = questions[initialQuestionNumber - 1];
  const [surveyReviewerState, dispatch] = useReducer(surveyReviewerReducer, {
    surveyId,
    summary,
    questions,
    activeQuestionNumber: initialQuestionNumber,
    activeQuestion,
    answers,
    participatingHospitals,
    onQuestionChange: (questionNumber: number) => {
      window.history.pushState(
        null,
        "",
        `/results/${surveyId}/questions/${questionNumber}`,
      );
    },
  });
  const [filteredHospitals, setFilteredHospitals] = useState<
    ParticipatingHospital[]
  >([]);

  return (
    <>
      <div className={styles.questionContent}>
        <Typography className={styles.surveyTitle} variant="h2">
          {summary.name}
        </Typography>
        <Autocomplete
          multiple
          options={participatingHospitals}
          getOptionLabel={(option) => option.hospital.name}
          renderInput={(params) => <TextField {...params} label="Location" />}
          onChange={(_, newValue) => {
            // eslint-disable-next-line no-console
            console.log(newValue);
            setFilteredHospitals(newValue);
          }}
          value={filteredHospitals}
        />
        {renderQuestion({
          question: surveyReviewerState.activeQuestion,
          answers:
            surveyReviewerState.answers[surveyReviewerState.activeQuestion.id],
          dispatch,
        })}
      </div>
      <div className={styles.questionsNavigation}>
        <Pagination
          count={questions.length}
          page={surveyReviewerState.activeQuestionNumber}
          color="primary"
          onChange={(_: ChangeEvent<unknown>, questionNumber: number) =>
            dispatch({ type: "setQuestionNumber", value: questionNumber })
          }
        />
      </div>
    </>
  );
}
