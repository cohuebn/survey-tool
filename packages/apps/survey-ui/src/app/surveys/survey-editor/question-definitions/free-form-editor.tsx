import { FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { QuestionDefinitionProps } from "../question-definition-props";
import styles from "../styles.module.css";

export function FreeFormEditor({
  questionId,
  definition,
  dispatch,
}: QuestionDefinitionProps) {
  const options = ["short", "long"];
  return (
    <div className={styles.labeledButtonGroup}>
      <FormLabel>Text Length</FormLabel>
      <ToggleButtonGroup
        aria-label="Text length"
        color="primary"
        exclusive
        value={definition.textLength ?? options[0]}
        onChange={(_, value) => {
          dispatch({
            type: "updateQuestionDefinition",
            questionId,
            value: { ...definition, textLength: value },
          });
        }}
      >
        <ToggleButton value="short">Short</ToggleButton>
        <ToggleButton value="long">Long</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
