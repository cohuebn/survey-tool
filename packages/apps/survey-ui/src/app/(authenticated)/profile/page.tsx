"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { useMemo } from "react";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";

import styles from "./styles.module.css";

export default function Page() {
  const { userSession } = useUserSession();
  const userProfile = useUserProfile();

  const loading = useMemo(
    () => !userSession.loggedIn || !userProfile,
    [userProfile, userSession.loggedIn],
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography className={styles.header} variant="h2">
        Your profile
      </Typography>
      <TextField className={styles.input} label="Location" autoFocus />
      <TextField className={styles.input} label="Department" />
      <Autocomplete
        options={["Private practice", "Hospital"]}
        className={styles.input}
        renderInput={(params) => (
          <TextField {...params} label="Employment type" />
        )}
      />
      <Button className={buttonStyles.button} variant="contained">
        Save
      </Button>
    </div>
  );
}
