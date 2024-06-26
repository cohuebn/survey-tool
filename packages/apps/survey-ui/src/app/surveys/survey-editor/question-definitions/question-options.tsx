import { FormLabel, IconButton, Tooltip } from "@mui/material";
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

export function QuestionOptions({
  questionId,
  definition,
  dispatch,
}: QuestionDefinitionProps) {
  const options = getOptions(definition);
  return (
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
            onClick={() => dispatch({ type: "addQuestionOption", questionId })}
          >
            <Add />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
