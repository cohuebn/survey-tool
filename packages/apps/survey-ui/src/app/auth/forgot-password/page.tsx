"use client";

import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { useCallback, useState } from "react";
import { createLogger } from "@survey-tool/core";
import { toast } from "react-toastify";
import { clsx } from "clsx";
import authStyles from "@styles/auth.module.css";
import buttonStyles from "@styles/buttons.module.css";

import { useFirebaseAuth } from "../../firebase/use-firebase-auth";
import { parseError } from "../../errors/parse-error";

const logger = createLogger("forgot-password");

export default function Page() {
  const firebaseAuth = useFirebaseAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [sendingRecoveryMessage, setSendingRecoveryMessage] =
    useState<boolean>(false);

  const sendRecoveryMessage = useCallback(
    async (_email: string) => {
      if (!firebaseAuth) {
        throw new Error(
          `Firebase auth initialization error. Cannot recover password.`,
        );
      }
      setSendingRecoveryMessage(true);
      try {
        const response = await sendPasswordResetEmail(firebaseAuth, _email);
        logger.debug({ response }, "Recovery message sent");
        toast(
          `Recovery message sent to ${_email}. After changing your password, you can login here`,
          { type: "success" },
        );
        router.push("/auth/login");
      } catch (err: unknown) {
        logger.error({ err }, "Error sending recovery message");
        toast(parseError(err), { type: "error" });
      } finally {
        setSendingRecoveryMessage(false);
      }
    },
    [firebaseAuth, router],
  );

  return (
    <div className={authStyles.container}>
      <div className={authStyles.backgroundFooter}></div>
      <Card className={authStyles.primarySection} elevation={3}>
        <CardContent>
          <Typography className={authStyles.leadSentence} variant="subtitle1">
            Enter your email and we&apos;ll send you a recovery message to reset
            your password.
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
            <div className={buttonStyles.buttons}>
              <Button
                className={clsx(buttonStyles.button, buttonStyles.maxWidth20)}
                variant="contained"
                onClick={() => sendRecoveryMessage(email)}
                disabled={sendingRecoveryMessage}
              >
                Send recovery message
              </Button>
            </div>
          </form>
          <p className={authStyles.alternateActionLink}>
            Need a new account instead?{" "}
            <Link href="/auth/signup">Create one here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
