"use client";

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import layoutStyles from "@styles/layout.module.css";
// import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import styles from "./styles.module.css";

export default function Faq() {
  // const searchParams = useSearchParams();
  // const expandedTab = searchParams.get("expandedTab");
  const expandedTab = "why-npi";

  const isExpandedTab = useCallback(
    (tab: string) => tab === expandedTab,
    [expandedTab],
  );

  return (
    <div
      className={clsx(
        layoutStyles.horizontallyCenteredContent,
        styles.container,
      )}
    >
      <Typography
        className={clsx(layoutStyles.centeredText, styles.header)}
        variant="h2"
      >
        FAQ
      </Typography>
      <div className={styles.questions}>
        <Accordion defaultExpanded={isExpandedTab("forgot-password")}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>
              I&apos;ve forgotten my password. How do I recover it?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can reset your password by clicking the &quot;Forgot your
              password?&quot; link on <a href="/auth/login">the login page</a>.
              You can also go directly to the reset password page from{" "}
              <a href="/auth/forgot-password">this link</a>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={isExpandedTab("why-npi")}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>
              You mention not storing personal data. But some details like NPI
              number are requested when setting up my profile. Why?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography gutterBottom={true}>
              Our application prioritizes user privacy, and we don&apos;t want
              to store any personally identifiable information (PII). However,
              we also need to ensure only legitimate healthcare providers can
              access surveys in order to keep the integrity of survey results.
              The solution we arrived at is to store the minimal amount of
              validating information (e.g. NPI number) temporarily so that one
              of our administrators can verify your identity. As soon as
              validation is completed, that information is then removed from our
              system. This data is no longer tied in any way to your account,
              survey answers, etc. after validation is complete.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
