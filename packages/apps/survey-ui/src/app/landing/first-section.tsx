"use client";

import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import docTyping from "@assets/doc-typing.png";
import logo from "@assets/logo.png";
import buttonStyles from "@styles/buttons.module.css";

import styles from "./first-section.module.css";

export function FirstSection() {
  const router = useRouter();

  return (
    <div className={styles.section}>
      <Image
        src={docTyping}
        alt="Doc typing background"
        fill
        className={styles.background}
      />
      <div className={styles.content}>
        <Image src={logo} alt="Doc Voice logo" className={styles.logo} />
        <Typography variant="h1">DocVoice</Typography>
        <Typography variant="h2">
          Empowering honesty, elevating healthcare
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
          <Button
            variant="contained"
            color="primary"
            className={buttonStyles.button}
            onClick={() => router.push("/auth/login")}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
