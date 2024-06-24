import { QuestionType } from "../../types";
import { QuestionDefinitionProps } from "../question-definition-props";

import { FreeFormEditor } from "./free-form-editor";
import { MultipleChoiceEditor } from "./multiple-choice";
import { RatingEditor } from "./rating-editor";

type RenderQuestionDefinitionProps = QuestionDefinitionProps & {
  questionType?: QuestionType;
};

export function renderQuestionDefinitionFields({
  questionId,
  questionType,
  definition,
  dispatch,
}: RenderQuestionDefinitionProps) {
  switch (questionType?.questionType) {
    case "Rating":
      return (
        <RatingEditor
          questionId={questionId}
          definition={definition}
          dispatch={dispatch}
        />
      );
    case "Free-form":
      return (
        <FreeFormEditor
          questionId={questionId}
          definition={definition}
          dispatch={dispatch}
        />
      );
    case "Multiple choice":
      return (
        <MultipleChoiceEditor
          questionId={questionId}
          definition={definition}
          dispatch={dispatch}
        />
      );
    default:
      return <></>;
  }
}
