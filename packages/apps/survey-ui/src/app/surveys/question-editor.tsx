import { ChangeEvent, Dispatch, useState } from "react";
import {
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "@mui/icons-material";

import { EditableQuestion, QuestionType, SurveyEditorAction } from "./types";
import styles from "./styles.module.css";
import { useQuestionTypes } from "./use-question-types";

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
  const [questionType, setQuestionType] = useState<QuestionType | null>(null);

  const dragStyles = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!questionTypesLoaded) {
    return <CircularProgress />;
  }

  return (
    <Card className={styles.questionCard} ref={setNodeRef} style={dragStyles}>
      <CardContent>
        <div className={styles.dragArea} {...attributes} {...listeners}>
          <DragHandle />
        </div>
        <Typography variant="body1" className={styles.questionNumber}>
          Question #{questionNumber}
        </Typography>
        <Autocomplete
          options={questionTypes}
          getOptionLabel={(option) => option.questionType}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              label="Question type"
              placeholder="The type of question (e.g. multiple choice, rating, etc.)"
            />
          )}
          value={questionType}
          onChange={(_, newQuestionType) => {
            setQuestionType(newQuestionType);
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
      </CardContent>
    </Card>
  );
}
