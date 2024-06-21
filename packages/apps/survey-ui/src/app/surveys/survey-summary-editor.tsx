import { Dispatch } from "react";
import { TextField } from "@mui/material";

import { emptyToUndefined } from "../utils/empty-to-undefined";

import { EditableSummary, SurveyEditorAction } from "./types";
import styles from "./styles.module.css";

type SurveySummaryEditorProps = {
  summary?: EditableSummary;
  dispatch: Dispatch<SurveyEditorAction>;
};

export function SurveySummaryEditor(props: SurveySummaryEditorProps) {
  return (
    <form className={styles.surveyEditorForm}>
      <TextField
        autoFocus
        label="Name"
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
        value={props.summary?.description ?? ""}
        onChange={(event) =>
          props.dispatch({
            type: "setSurveyDescription",
            value: emptyToUndefined(event.target.value),
          })
        }
        fullWidth
      />
    </form>
  );
}
