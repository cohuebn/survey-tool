import { Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import docTyping from "@assets/doc-typing.png";
import logo from "@assets/logo.png";

import styles from "./styles.module.css";

export default function Page() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={styles.firstSection}>
          <Image
            src={docTyping}
            alt="Doc typing background"
            fill
            className={styles.firstSectionBackground}
          />
          <div className={styles.firstSectionContent}>
            <Image src={logo} alt="Doc Voice logo" className={styles.logo} />
            <Typography variant="h1">Doc Voice</Typography>
            <Typography variant="h2">
              Empowering honesty, elevating healthcare
            </Typography>
            <div className={styles.buttons}>
              <Button variant="contained" color="primary" size="large">
                Get started
              </Button>
              <Button variant="contained" color="primary" size="large">
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        2nd section
      </Grid>
    </Grid>
  );
}
