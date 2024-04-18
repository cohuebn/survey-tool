"use client";

import {
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import { createLogger } from "@survey-tool/core";
import { toast } from "react-toastify";

import buttonStyles from "../styles/buttons.module.css";
import { useFirebaseAuth } from "../firebase/use-firebase-auth";
import { parseError } from "../errors/parse-error";

import styles from "./styles.module.css";

const logger = createLogger("login");

export default function Page() {
  const firebaseAuth = useFirebaseAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signingIn, setSigningIn] = useState<boolean>(false);

  const signIn = useCallback(
    async (_email: string, _password: string) => {
      if (!firebaseAuth) {
        throw new Error(`Firebase auth initialization error. Cannot sign in.`);
      }
      setSigningIn(true);
      try {
        const signinResponse = await signInWithEmailAndPassword(
          firebaseAuth,
          _email,
          _password,
        );
        logger.debug({ user: signinResponse.user });
      } catch (err: unknown) {
        logger.error({ err }, "Error logging in");
        toast(parseError(err), { type: "error" });
      } finally {
        setSigningIn(false);
      }
    },
    [firebaseAuth],
  );

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <Link href="/forgot-password">Forgot your password?</Link>
            <div className={buttonStyles.buttons}>
              <Button
                className={buttonStyles.button}
                variant="contained"
                onClick={() => signIn(email, password)}
                disabled={signingIn}
              >
                Login
              </Button>
            </div>
          </form>
          <p className={styles.signup}>
            Don&apos;t have an account?{" "}
            <Link href="/signup">Create one here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
