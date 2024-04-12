import { Button, Typography } from "@mui/material";

import headingStyles from "../styles/headings.module.css";
import buttonStyles from "../styles/buttons.module.css";

import styles from "./sixth-section.module.css";

export function SixthSection() {
  return (
    <div className={styles.section}>
      <Typography className={headingStyles.sectionHeader} variant="h3">
        Ready to start creating and taking surveys?
      </Typography>
      <div className={buttonStyles.buttons}>
        <Button
          variant="contained"
          color="primary"
          className={buttonStyles.button}
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
