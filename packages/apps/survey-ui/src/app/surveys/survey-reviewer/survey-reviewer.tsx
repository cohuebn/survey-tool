import { ChangeEvent, useMemo, useReducer, useState } from "react";
import {
  Autocomplete,
  Chip,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";

import {
  AggregatedAnswerWithLocationForQuestion,
  ParticipatingHospital,
  Question,
  SurveySummary,
} from "../types";
import { combineAnswersFromMultipleLocations } from "../answers/answer-converters";

import { surveyReviewerReducer } from "./survey-reviewer-reducer";
import styles from "./styles.module.css";
import { renderQuestion } from "./question-review";

type SurveyReviewerProps = {
  surveyId: string;
  summary: SurveySummary;
  questions: Question[];
  allAnswers: AggregatedAnswerWithLocationForQuestion[];
  initialQuestionNumber: number;
  participatingHospitals: ParticipatingHospital[];
};

export function SurveyReviewer({
  surveyId,
  summary,
  questions,
  allAnswers,
  initialQuestionNumber,
  participatingHospitals,
}: SurveyReviewerProps) {
  const activeQuestion = questions[initialQuestionNumber - 1];
  const [filteredHospitals, setFilteredHospitals] = useState<
    ParticipatingHospital[]
  >([]);
  const relevantLocationIds = useMemo(() => {
    return filteredHospitals.map((hospital) => hospital.hospital.id);
  }, [filteredHospitals]);
  const answers = useMemo(() => {
    const relevantAnswers = relevantLocationIds.length
      ? allAnswers.filter((answer) =>
          relevantLocationIds.includes(answer.location),
        )
      : allAnswers;
    return combineAnswersFromMultipleLocations(relevantAnswers);
  }, [allAnswers, relevantLocationIds]);
  const [surveyReviewerState, dispatch] = useReducer(surveyReviewerReducer, {
    surveyId,
    summary,
    questions,
    activeQuestionNumber: initialQuestionNumber,
    activeQuestion,
    allAnswers,
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

  return (
    <>
      <div className={styles.questionContent}>
        <Typography className={styles.surveyTitle} variant="h2">
          {summary.name}
        </Typography>
        <Autocomplete
          multiple
          fullWidth
          options={participatingHospitals}
          getOptionLabel={(option) => option.hospital.name}
          renderInput={(params) => <TextField {...params} label="Location" />}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  variant={"outlined"}
                  color={"primary"}
                  size={"small"}
                  key={key}
                  label={option.hospital.name}
                  {...tagProps}
                />
              );
            })
          }
          onChange={(_, newValue) => {
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
