import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import Link from "next/link";

import buttonStyles from "../styles/buttons.module.css";

import styles from "./styles.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundFooter}></div>
      <Card className={styles.loginSection} elevation={3}>
        <CardContent>
          <Typography className={styles.loginHeader} variant="h2">
            Sign in
          </Typography>
          <Typography className={styles.loginSubheader} variant="h3">
            Welcome back!
          </Typography>

          <form className={styles.loginForm}>
            <TextField
              placeholder="Email"
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <TextField
              type="password"
              placeholder="Password"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <Link href="/forgot-password">Forgot your password?</Link>
            <div className={buttonStyles.buttons}>
              <Button className={buttonStyles.button} variant="contained">
                Login
              </Button>
            </div>
          </form>
          <p className={styles.signup}>
            Don't have an account? <Link href="/sign-up">Create one here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
