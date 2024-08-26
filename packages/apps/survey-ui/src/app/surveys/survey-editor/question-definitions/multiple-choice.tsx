import { FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { QuestionDefinitionProps } from "../question-definition-props";
import styles from "../styles.module.css";
import { MultipleChoiceType } from "../../types";

import { QuestionOptions } from "./question-options";

export function MultipleChoiceEditor({
  questionId,
  definition,
  dispatch,
}: QuestionDefinitionProps) {
  const singleAnswer: MultipleChoiceType = "singleAnswer";
  const multipleAnswers: MultipleChoiceType = "multipleAnswers";
  const multipleChoiceTypes: MultipleChoiceType[] = [
    singleAnswer,
    multipleAnswers,
  ];

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
      <QuestionOptions
        questionId={questionId}
        definition={definition}
        dispatch={dispatch}
      />
    </>
  );
}
