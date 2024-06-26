import { Dispatch } from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import { Close, DragIndicator } from "@mui/icons-material";

import { SurveyEditorAction } from "../../types";
import styles from "../styles.module.css";

type QuestionOptionProps = {
  questionId: string;
  index: number;
  option: string;
  dispatch: Dispatch<SurveyEditorAction>;
};

export function QuestionOption({
  questionId,
  index,
  option,
  dispatch,
}: QuestionOptionProps) {
  return (
    <div className={styles.questionOption}>
      <IconButton className={styles.dragHandle}>
        <DragIndicator />
      </IconButton>
      <TextField
        key={index}
        fullWidth
        multiline
        placeholder={`Option ${index + 1}`}
        label={`Option ${index + 1}`}
        value={option}
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
            type: "updateQuestionOption",
            questionId,
            optionIndex: index,
            value: event.target.value,
          });
        }}
      />
    </div>
  );
}
