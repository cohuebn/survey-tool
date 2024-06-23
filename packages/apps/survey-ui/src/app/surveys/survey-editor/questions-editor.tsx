import { Dispatch, useState } from "react";
import { Alert } from "@mui/material";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  EditableQuestion,
  SurveyEditorAction,
  SurveyValidationError,
} from "../types";

import styles from "./styles.module.css";
import { QuestionEditor } from "./question-editor";

type QuestionsEditorProps = {
  questions: EditableQuestion[];
  validationErrors: SurveyValidationError[];
  dispatch: Dispatch<SurveyEditorAction>;
};

export function QuestionsEditor({
  questions,
  validationErrors,
  dispatch,
}: QuestionsEditorProps) {
  const [, setDraggedElement] = useState<Active | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setDraggedElement(active);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id !== over.id) {
      dispatch({
        type: "moveQuestion",
        questionId: `${active.id}`,
        targetIndex: questions.findIndex((question) => question.id === over.id),
      });
    }
  }

  return (
    <form className={styles.surveyEditorForm}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question, questionIndex) => (
            <QuestionEditor
              key={question.id}
              question={question}
              questionNumber={questionIndex + 1}
              dispatch={dispatch}
            />
          ))}
        </SortableContext>
      </DndContext>

      {validationErrors.length ? (
        <Alert severity="error">{validationErrors[0].message}</Alert>
      ) : null}
    </form>
  );
}
