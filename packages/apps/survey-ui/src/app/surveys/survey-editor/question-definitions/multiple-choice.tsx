import {
  FormLabel,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import clsx from "clsx";

import { QuestionDefinitionProps } from "../question-definition-props";
import styles from "../styles.module.css";

import { QuestionOption } from "./question-option";

function getOptions(definition: Record<string, unknown>): string[] {
  const { options } = definition;
  return options && Array.isArray(options) ? options : [];
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
      <div className={styles.questionSubsection}>
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
      <div className={clsx(styles.questionSubsection, styles.optionsSection)}>
        <FormLabel>Options</FormLabel>
        {options.map((option, index) => (
          <QuestionOption
            key={`${questionId}-option-${index}`}
            questionId={questionId}
            index={index}
            option={option}
            dispatch={dispatch}
          />
        ))}
        <div className={layoutStyles.centeredContent}>
          <Tooltip title="Add a multiple-choice option for this question">
            <IconButton
              onClick={() =>
                dispatch({ type: "addQuestionOption", questionId })
              }
            >
              <Add />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
