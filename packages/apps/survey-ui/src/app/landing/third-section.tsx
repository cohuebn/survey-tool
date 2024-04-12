import { Typography } from "@mui/material";
import { Lock, Poll, PsychologyAlt } from "@mui/icons-material";

import { productName } from "../constants";
import headingStyles from "../styles/headings.module.css";

import styles from "./third-section.module.css";

export function ThirdSection() {
  return (
    <div className={styles.section}>
      <Typography className={headingStyles.sectionHeader} variant="h3">
        Why choose {productName}?
      </Typography>
      <div className={styles.points}>
        <div className={styles.point}>
          <PsychologyAlt className={styles.icon} />
          <Typography className={styles.pointHeading} variant="h4">
            Gain meaningful feedback
          </Typography>
          <p className={styles.details}>
            Anyone who wants to conduct a survey can author it in the system. A
            range of question types are supported including multiple-choice,
            free-form answer, and rating questions. This mix of question types
            allows closed-ended quantitative data and open-ended qualitative
            insights
          </p>
        </div>
        <div className={styles.point}>
          <Lock className={styles.icon} />
          <Typography className={styles.pointHeading} variant="h4">
            Anonymously share your voice
          </Typography>
          <p className={styles.details}>
            Participants choose to take surveys regarding their location,
            practice, and general surveys. Survey answers are not traceable back
            to the person who submitted them. This allows for participants to be
            completely honest and transparent without fear of repercussion.
          </p>
        </div>
        <div className={styles.point}>
          <Poll className={styles.icon} />
          <Typography className={styles.pointHeading} variant="h4">
            Drive positive change
          </Typography>
          <p className={styles.details}>
            Approved reviewers can analyze survey results. Results can be
            grouped and aggregated to make actionable insights. From individual
            survey responses to overarching trends, our analytics capabilities
            provide the clarity and depth required for confident decision-making
            in the dynamic landscape of the medical industry.
          </p>
        </div>
      </div>
    </div>
  );
}
