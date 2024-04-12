import { Button, Typography } from "@mui/material";
import Image from "next/image";
import docTyping from "@assets/doc-typing.png";
import logo from "@assets/logo.png";

import styles from "./first-section.module.css";

export function FirstSection() {
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
        <Typography variant="h1">Doc Voice</Typography>
        <Typography variant="h2">
          Empowering honesty, elevating healthcare
        </Typography>
        <div className={styles.buttons}>
          <Button variant="contained" color="primary" className={styles.button}>
            Get started
          </Button>
          <Button variant="contained" color="primary" className={styles.button}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
