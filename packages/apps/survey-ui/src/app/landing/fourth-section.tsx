import { Typography } from "@mui/material";

import headingStyles from "../styles/headings.module.css";

import styles from "./fourth-section.module.css";

export function FourthSection() {
  return (
    <div className={styles.section}>
      <Typography className={headingStyles.sectionHeader} variant="h3">
        Your identity is protected
      </Typography>
      <p className={styles.details}>
        When you participate in surveys on the platform, your identity is not
        stored with your answers. A unique one-way signature is created to allow
        secure, authorized survey participation; however, your survey answers
        can’t be traced back to anything personally identifying you. No
        username, session keys, etc. are tracked with your answers. This allows
        you to answer freely and honestly.
      </p>
    </div>
  );
}
