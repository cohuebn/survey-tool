import { ChangeEvent, Dispatch } from "react";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "@mui/icons-material";

import { EditableQuestion, SurveyEditorAction } from "./types";
import styles from "./styles.module.css";

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

  const dragStyles = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card className={styles.questionCard} ref={setNodeRef} style={dragStyles}>
      <CardContent>
        <div className={styles.dragArea} {...attributes} {...listeners}>
          <DragHandle />
        </div>
        <Typography variant="body1" className={styles.questionNumber}>
          Question #{questionNumber}
        </Typography>
        <TextField
          multiline
          fullWidth
          autoFocus
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
      </CardContent>
    </Card>
  );
}
