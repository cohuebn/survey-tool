"use client";

import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import headingStyles from "@styles/headings.module.css";
import buttonStyles from "@styles/buttons.module.css";

import styles from "./sixth-section.module.css";

export function SixthSection() {
  const router = useRouter();

  return (
    <div className={styles.section}>
      <Typography className={headingStyles.sectionHeader} variant="h3">
        Ready to start creating and taking surveys?
      </Typography>
      <div className={clsx(buttonStyles.buttons, buttonStyles.withTopMargin)}>
        <Button
          variant="contained"
          color="primary"
          className={buttonStyles.button}
          onClick={() => router.push("/auth/signup")}
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
