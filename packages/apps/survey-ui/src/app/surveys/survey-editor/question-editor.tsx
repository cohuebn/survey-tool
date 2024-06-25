import { ChangeEvent, Dispatch, useMemo, useState } from "react";
import {
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Close, DragHandle } from "@mui/icons-material";
import buttonStyles from "@styles/buttons.module.css";

import { EditableQuestion, QuestionType, SurveyEditorAction } from "../types";
import { useQuestionTypes } from "../questions";

import styles from "./styles.module.css";
import { renderQuestionDefinitionFields } from "./question-definitions";

type QuestionEditorProps = {
  question: EditableQuestion;
  questionNumber: number;
  dispatch: Dispatch<SurveyEditorAction>;
};

/** Represents a question as shown in the 'authoring' pages */
export function QuestionEditor({
  question,
  questionNumber,
  dispatch,
}: QuestionEditorProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });
  const { questionTypes, questionTypesLoaded } = useQuestionTypes();
  const [questionType, setQuestionType] = useState<QuestionType | null>(
    question.questionType ?? null,
  );

  const dragStyles = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const questionDefinitionSection = useMemo(
    () =>
      renderQuestionDefinitionFields({
        questionId: question.id,
        definition: question.definition ?? {},
        questionType: question.questionType,
        dispatch,
      }),
    [dispatch, question.definition, question.id, question.questionType],
  );

  if (!questionTypesLoaded) {
    return <CircularProgress />;
  }

  return (
    <Card className={styles.questionCard} ref={setNodeRef} style={dragStyles}>
      <CardContent>
        <div className={styles.topBar}>
          <div className={styles.dragArea} {...attributes} {...listeners}>
            <DragHandle />
          </div>
          <Tooltip title="Delete this question">
            <IconButton
              className={buttonStyles.dangerButton}
              onClick={() =>
                dispatch({ type: "deleteQuestion", questionId: question.id })
              }
            >
              <Close />
            </IconButton>
          </Tooltip>
        </div>
        <Typography variant="body1" className={styles.questionNumber}>
          Question #{questionNumber}
        </Typography>
        <div className={styles.questionFields}>
          <Autocomplete
            options={questionTypes}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.questionType}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Question type"
                placeholder="The type of question (e.g. multiple choice, rating, etc.)"
              />
            )}
            value={questionType}
            onChange={(_, newQuestionType) => {
              setQuestionType(newQuestionType);
              dispatch({
                type: "setQuestionType",
                questionId: question.id,
                value: newQuestionType ?? undefined,
              });
            }}
            className={styles.questionInput}
          />
          <TextField
            multiline
            fullWidth
            placeholder="The question to ask"
            label="Question"
            value={question.question ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                type: "setQuestionText",
                questionId: question.id,
                value: event.target.value,
              });
            }}
          />
          {questionDefinitionSection}
        </div>
      </CardContent>
    </Card>
  );
}
