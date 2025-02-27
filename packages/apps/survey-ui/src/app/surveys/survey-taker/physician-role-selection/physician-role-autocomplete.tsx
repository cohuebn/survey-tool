import { Autocomplete, TextField, Typography } from "@mui/material";

import { getSpreadableOptionProps } from "../../../utils/autocompletes";
import styles from "../styles.module.css";

import { PhysicianRoleSelectionProps } from "./types";

export function PhysicianRoleAutocomplete({
  autoFocus,
  physicianRoles,
  onChange,
}: PhysicianRoleSelectionProps) {
  return (
    <Autocomplete
      autoFocus={autoFocus}
      options={physicianRoles}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Role" placeholder="Select a role" />
      )}
      renderOption={(props, option) => {
        const spreadableProps = getSpreadableOptionProps(props);
        return (
          <li
            key={option.id}
            {...spreadableProps}
            className={styles.roleOption}
          >
            {option.hospital?.name}
            <Typography variant="caption">
              {option.department} ({option.employmentType})
            </Typography>
          </li>
        );
      }}
      getOptionLabel={(option) =>
        `${option.hospital?.name} - ${option.department}`
      }
    />
  );
}
