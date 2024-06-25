import {
  FormLabel,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { QuestionDefinitionProps } from "../question-definition-props";
import styles from "../styles.module.css";

function getOptions(definition: Record<string, unknown>): string[] {
  const { options } = definition;
  return options && Array.isArray(options) ? options : [];
}

function getOptionsWithUpdate(
  options: string[],
  index: number,
  value: string,
): string[] {
  return options.map((option, i) => (i === index ? value : option));
}

export function MultipleChoiceEditor({
  questionId,
  definition,
  dispatch,
}: QuestionDefinitionProps) {
  const singleAnswer = "singleAnswer";
  const multipleAnswers = "multipleAnswers";
  const multipleChoiceTypes = [singleAnswer, multipleAnswers];
  const options = getOptions(definition);

  return (
    <>
      <div className={styles.labeledButtonGroup}>
        <FormLabel>Multiple choice type</FormLabel>
        <ToggleButtonGroup
          aria-label="Answer count"
          color="primary"
          exclusive
          value={definition.multipleChoiceType ?? multipleChoiceTypes[0]}
          onChange={(_, value) => {
            dispatch({
              type: "updateQuestionDefinition",
              questionId,
              value: { ...definition, multipleChoiceType: value },
            });
          }}
        >
          <ToggleButton value={singleAnswer}>Single answer</ToggleButton>
          <ToggleButton value={multipleAnswers}>Multiple answers</ToggleButton>
        </ToggleButtonGroup>
      </div>
      {options.map((option, index) => (
        <TextField
          key={index}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(event) => {
            dispatch({
              type: "updateQuestionDefinition",
              questionId,
              value: {
                ...definition,
                options: getOptionsWithUpdate(
                  options,
                  index,
                  event.target.value,
                ),
              },
            });
          }}
        />
      ))}
      <div>
        <Tooltip title="Add a multiple-choice option for this question">
          <IconButton>
            <Add />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}
