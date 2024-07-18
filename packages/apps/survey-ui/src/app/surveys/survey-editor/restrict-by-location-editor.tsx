import { Dispatch } from "react";
import { Chip } from "@mui/material";

import { HospitalAutocomplete } from "../../hospitals/hospital-autocomplete";
import { Hospital } from "../../hospitals/types";
import { SurveyAllowedLocation, SurveyEditorAction } from "../types";

import styles from "./styles.module.css";

type RestrictByLocationEditorProps = {
  locationRestrictions: SurveyAllowedLocation[];
  dispatch: Dispatch<SurveyEditorAction>;
};

export function RestrictByLocationEditor({
  dispatch,
  locationRestrictions,
}: RestrictByLocationEditorProps) {
  const onHospitalChange = (hospital: Hospital | null) => {
    if (hospital) {
      dispatch({ type: "addAllowedLocation", value: hospital });
    }
  };
  const onRemoveLocation = (location: SurveyAllowedLocation) => {
    dispatch({ type: "removeAllowedLocation", value: location.id });
  };

  return (
    <>
      <HospitalAutocomplete
        label="Add a location"
        onChange={onHospitalChange}
      />
      <div className={styles.selectedChips}>
        {locationRestrictions.map((location) => {
          return (
            <Chip
              key={location.id}
              label={location.location.name}
              onDelete={() => onRemoveLocation(location)}
            />
          );
        })}
      </div>
    </>
  );
}
