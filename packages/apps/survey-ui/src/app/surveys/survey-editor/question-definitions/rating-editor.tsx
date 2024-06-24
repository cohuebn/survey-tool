import { TextField } from "@mui/material";

import { QuestionDefinitionProps } from "../question-definition-props";
import styles from "../styles.module.css";

export function RatingEditor({
  questionId,
  definition,
  dispatch,
}: QuestionDefinitionProps) {
  return (
    <div className={styles.minMaxRatingContainer}>
      <TextField
        type="number"
        placeholder="The minimum rating allowed"
        label="Minimum rating"
        value={definition?.minRating ?? ""}
        onChange={(event) =>
          dispatch({
            type: "updateQuestionDefinition",
            questionId,
            value: {
              ...definition,
              minRating: parseInt(event.target.value, 10),
            },
          })
        }
      />
      <TextField
        type="number"
        placeholder="The maximum rating allowed"
        label="Maximum rating"
        value={definition?.maxRating ?? ""}
        onChange={(event) =>
          dispatch({
            type: "updateQuestionDefinition",
            questionId,
            value: {
              ...definition,
              maxRating: parseInt(event.target.value, 10),
            },
          })
        }
      />
    </div>
  );
}
