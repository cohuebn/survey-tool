"use client";

import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";

import styles from "./styles.module.css";

export default function Page() {
  return (
    <div className={layoutStyles.centeredContent}>
      <Typography className={styles.header} variant="h2">
        Your profile
      </Typography>
      <TextField className={styles.input} label="Location" />
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
