import { Typography } from "@mui/material";

import styles from "../styles.module.css";

import { PhysicianRoleAutocomplete } from "./physician-role-autocomplete";
import { PhysicianRoleSelectionProps } from "./types";

export function PhysicianRoleSelection(props: PhysicianRoleSelectionProps) {
  return (
    <div className={styles.questionContent}>
      <Typography variant="h2">Select Role</Typography>
      <Typography variant="body1" className={styles.roleSelectionDescription}>
        Please select which of your roles you wish take this survey for.
      </Typography>
      <PhysicianRoleAutocomplete {...props} />
    </div>
  );
}
