import { Typography } from "@mui/material";
import headingStyles from "@styles/headings.module.css";

import styles from "./fifth-section.module.css";

export function FifthSection() {
  return (
    <div className={styles.section}>
      <Typography className={headingStyles.sectionHeader} variant="h3">
        Capturing Insights Across the Healthcare Spectrum
      </Typography>
      <p className={styles.details}>
        Hospital reviews | Insurance provider reviews | Nursing home reviews |
        Protocol surveys | Broader medical trends | And more
      </p>
    </div>
  );
}
