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
import { useCallback, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-toastify";
import { createLogger } from "@survey-tool/core";

import buttonStyles from "../styles/buttons.module.css";
import authStyles from "../styles/auth.module.css";
import { useFirebaseAuth } from "../firebase/use-firebase-auth";
import { parseError } from "../errors/parse-error";

const logger = createLogger("signup");

export default function Page() {
  const firebaseAuth = useFirebaseAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signingIn, setSigningIn] = useState<boolean>(false);

  const signUp = useCallback(
    async (_email: string, _password: string) => {
      if (!firebaseAuth) {
        throw new Error(`Firebase auth initialization error. Cannot sign in.`);
      }
      setSigningIn(true);
      try {
        const { user } = await createUserWithEmailAndPassword(
          firebaseAuth,
          _email,
          _password,
        );
        if (!user.emailVerified) {
          await sendEmailVerification(user);
        }
      } catch (err: unknown) {
        logger.error({ err }, "Error signing up");
        toast(parseError(err), { type: "error" });
      } finally {
        setSigningIn(false);
      }
    },
    [firebaseAuth],
  );

  return (
    <div className={authStyles.container}>
      <div className={authStyles.backgroundFooter}></div>
      <Card className={authStyles.primarySection} elevation={3}>
        <CardContent>
          <Typography className={authStyles.header} variant="h2">
            Sign up
          </Typography>
          <Typography className={authStyles.subheader} variant="h3">
            We&rsquo;re glad you&rsquo;re here!
          </Typography>

          <form className={authStyles.form}>
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
              type={showPassword ? "text" : "password"}
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
            <div className={buttonStyles.buttons}>
              <Button
                className={buttonStyles.button}
                variant="contained"
                onClick={() => signUp(email, password)}
                disabled={signingIn}
              >
                Sign up
              </Button>
            </div>
          </form>
          <p className={authStyles.alternateActionLink}>
            Already have an account? <Link href="/login">Login here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
