import { Dispatch } from "react";
import { FormControlLabel, Switch } from "@mui/material";

import { SurveyEditorAction, SurveyPermissions } from "../types";
import { HospitalAutocomplete } from "../../hospitals/hospital-autocomplete";

import styles from "./styles.module.css";

type PermissionsEditorProps = {
  permissions: SurveyPermissions;
  dispatch: Dispatch<SurveyEditorAction>;
};

export function PermissionsEditor({
  permissions,
  dispatch,
}: PermissionsEditorProps) {
  const onSwitchChange = (
    type: "setIsPublic" | "setRestrictByLocation" | "setRestrictByDepartment",
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({
      type,
      value: event.target.checked,
    });
  };

  return (
    <form className={styles.surveyEditorForm}>
      <FormControlLabel
        control={
          <Switch
            checked={permissions.isPublic}
            onChange={(event) => onSwitchChange("setIsPublic", event)}
          />
        }
        label="Public survey?"
      />
      <div className={styles.toggledPermissions}>
        <FormControlLabel
          control={
            <Switch
              checked={permissions.restrictByLocation}
              disabled={permissions.isPublic}
              onChange={(event) =>
                onSwitchChange("setRestrictByLocation", event)
              }
            />
          }
          label="Restrict by location?"
        />
        <HospitalAutocomplete label="Add a location" />
      </div>
      <FormControlLabel
        control={
          <Switch
            checked={permissions.restrictByDepartment}
            disabled={permissions.isPublic}
            onChange={(event) =>
              onSwitchChange("setRestrictByDepartment", event)
            }
          />
        }
        label="Restrict by department?"
      />
    </form>
  );
}
