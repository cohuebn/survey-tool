import { Dispatch } from "react";
import { FormControlLabel, Switch } from "@mui/material";

import { SurveyEditorAction, SurveyPermissionDetails } from "../types";

import styles from "./styles.module.css";
import { RestrictByLocationEditor } from "./restrict-by-location-editor";

type PermissionsEditorProps = {
  permissions: SurveyPermissionDetails;
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
            checked={permissions.permissions.isPublic}
            onChange={(event) => onSwitchChange("setIsPublic", event)}
          />
        }
        label="Public survey?"
      />
      <div className={styles.toggledPermissions}>
        <FormControlLabel
          control={
            <Switch
              checked={permissions.permissions.restrictByLocation}
              disabled={permissions.permissions.isPublic}
              onChange={(event) =>
                onSwitchChange("setRestrictByLocation", event)
              }
            />
          }
          label="Restrict by location?"
        />
        {permissions.permissions.restrictByLocation ? (
          <RestrictByLocationEditor
            locationRestrictions={permissions.locationRestrictions}
            dispatch={dispatch}
          />
        ) : null}
      </div>
      <FormControlLabel
        control={
          <Switch
            checked={permissions.permissions.restrictByDepartment}
            disabled={permissions.permissions.isPublic}
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
