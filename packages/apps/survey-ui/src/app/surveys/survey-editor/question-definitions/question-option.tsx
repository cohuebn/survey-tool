import { Dispatch } from "react";
import {
  Box,
  IconButton,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { Close, DragIndicator } from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

import { MultipleChoiceOption, SurveyEditorAction } from "../../types";
import styles from "../styles.module.css";

type QuestionOptionProps = {
  questionId: string;
  index: number;
  option: MultipleChoiceOption;
  includeInOverallRating?: boolean;
  dispatch: Dispatch<SurveyEditorAction>;
};

export function QuestionOption({
  questionId,
  index,
  option,
  includeInOverallRating,
  dispatch,
}: QuestionOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.value });

  const dragStyles = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overallRatingControl = includeInOverallRating ? (
    <Box
      className={clsx(
        styles.optionRating,
        layoutStyles.verticallyCenteredContent,
      )}
    >
      <Typography variant="caption" className={styles.optionRatingLegend}>
        Rating
      </Typography>
      <Rating
        precision={0.5}
        value={option.numericValue}
        onChange={(_, value) => {
          dispatch({
            type: "updateQuestionOptionRating",
            questionId,
            optionIndex: index,
            value: value ?? 0,
          });
        }}
      />
    </Box>
  ) : null;

  return (
    <div className={styles.questionOption} ref={setNodeRef} style={dragStyles}>
      <IconButton className={styles.dragHandle} {...attributes} {...listeners}>
        <DragIndicator />
      </IconButton>
      <div className={styles.optionTextAndRating}>
        <TextField
          key={index}
          multiline
          fullWidth
          placeholder={`Option ${index + 1}`}
          label={`Option ${index + 1}`}
          value={option.value}
          InputProps={{
            endAdornment: (
              <Tooltip title="Delete this option">
                <IconButton
                  className={buttonStyles.dangerButton}
                  onClick={() =>
                    dispatch({
                      type: "deleteQuestionOption",
                      questionId,
                      optionIndex: index,
                    })
                  }
                >
                  <Close />
                </IconButton>
              </Tooltip>
            ),
          }}
          onChange={(event) => {
            dispatch({
              type: "updateQuestionOptionText",
              questionId,
              optionIndex: index,
              value: event.target.value,
            });
          }}
        />
        {overallRatingControl}
      </div>
    </div>
  );
}
