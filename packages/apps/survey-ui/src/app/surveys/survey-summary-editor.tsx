import { Dispatch } from "react";
import { Alert, TextField } from "@mui/material";

import { emptyToUndefined } from "../utils/empty-to-undefined";

import {
  EditableSummary,
  SurveyEditorAction,
  SurveyValidationError,
} from "./types";
import styles from "./styles.module.css";

type SurveySummaryEditorProps = {
  summary: EditableSummary;
  validationErrors: SurveyValidationError[];
  dispatch: Dispatch<SurveyEditorAction>;
};

export function SurveySummaryEditor(props: SurveySummaryEditorProps) {
  return (
    <form className={styles.surveyEditorForm}>
      <TextField
        autoFocus
        label="Name"
        placeholder="The name of the survey"
        value={props.summary?.name ?? ""}
        onChange={(event) =>
          props.dispatch({
            type: "setSurveyName",
            value: emptyToUndefined(event.target.value),
          })
        }
        fullWidth
      />
      <TextField
        label="Subtitle"
        placeholder="An optional subtitle to add a little context"
        value={props.summary?.subtitle ?? ""}
        onChange={(event) =>
          props.dispatch({
            type: "setSurveySubtitle",
            value: emptyToUndefined(event.target.value),
          })
        }
        fullWidth
      />
      <TextField
        label="Description"
        multiline
        placeholder="An optional description to add more detail about what a survey covers, its purpose, etc."
        value={props.summary?.description ?? ""}
        onChange={(event) =>
          props.dispatch({
            type: "setSurveyDescription",
            value: emptyToUndefined(event.target.value),
          })
        }
        fullWidth
      />
      {props.validationErrors.length ? (
        <Alert severity="error">{props.validationErrors[0].message}</Alert>
      ) : null}
    </form>
  );
}
