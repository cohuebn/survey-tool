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
import authStyles from "@styles/auth.module.css";
import buttonStyles from "@styles/buttons.module.css";
import { useRouter } from "next/navigation";

import { useFirebaseAuth } from "../../firebase/use-firebase-auth";
import { parseError } from "../../errors/parse-error";
import { useUserSession } from "../use-user-session";
import { isAuthenticatedUser } from "../authenticated-user";

const logger = createLogger("login");

export default function Page() {
  const firebaseAuth = useFirebaseAuth();
  const router = useRouter();
  const { setAuthenticatedUser } = useUserSession();
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
        if (!signinResponse.user.emailVerified) {
          throw new Error(
            "Please verify your email address before logging in. Check your inbox for a verification email.",
          );
        }
        if (!isAuthenticatedUser(signinResponse.user)) {
          throw new Error("User is not authenticated");
        }
        setAuthenticatedUser(signinResponse.user);
        router.push("/home");
      } catch (err: unknown) {
        logger.error({ err }, "Error logging in");
        toast(parseError(err), { type: "error" });
      } finally {
        setSigningIn(false);
      }
    },
    [firebaseAuth, router, setAuthenticatedUser],
  );

  return (
    <div className={authStyles.container}>
      <div className={authStyles.backgroundFooter}></div>
      <Card className={authStyles.primarySection} elevation={3}>
        <CardContent>
          <Typography className={authStyles.header} variant="h2">
            Sign in
          </Typography>
          <Typography className={authStyles.subheader} variant="h3">
            Welcome back!
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
            <Link href="/auth/forgot-password">Forgot your password?</Link>
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
          <p className={authStyles.alternateActionLink}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup">Create one here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
