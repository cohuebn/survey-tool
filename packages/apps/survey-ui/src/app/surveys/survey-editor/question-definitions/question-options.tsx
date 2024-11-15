import { FormLabel, IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import layoutStyles from "@styles/layout.module.css";
import clsx from "clsx";
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
import { useMemo, useState } from "react";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { QuestionDefinitionProps } from "../question-definition-props";
import styles from "../styles.module.css";
import { getOptions } from "../../questions/definitions";

import { QuestionOption } from "./question-option";

export function QuestionOptions({
  questionId,
  definition,
  dispatch,
}: QuestionDefinitionProps) {
  const [, setDraggedElement] = useState<Active | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const options = useMemo(() => getOptions(definition), [definition]);
  const optionStrings = useMemo(
    () => options.map((option) => option.value),
    [options],
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
        type: "moveOption",
        questionId,
        option: `${active.id}`,
        targetIndex: options.findIndex(
          (option) => option.value === `${over.id}`,
        ),
      });
    }
  }

  return (
    <div className={clsx(styles.questionSubsection, styles.optionsSection)}>
      <FormLabel>Options</FormLabel>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={optionStrings}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.options}>
            {options.map((option, index) => (
              <QuestionOption
                key={`${questionId}-option-${index}`}
                questionId={questionId}
                index={index}
                option={option}
                includeInOverallRating={Boolean(
                  definition.includeInOverallRating,
                )}
                dispatch={dispatch}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
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
