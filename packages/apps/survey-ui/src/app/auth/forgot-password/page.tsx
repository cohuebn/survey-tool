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
import { useCallback, useState } from "react";
import { createLogger } from "@survey-tool/core";
import { toast } from "react-toastify";
import { clsx } from "clsx";
import authStyles from "@styles/auth.module.css";
import buttonStyles from "@styles/buttons.module.css";

import { parseError } from "../../errors/parse-error";
import { useSupabaseAuth } from "../../supabase/use-supabase-auth";

const logger = createLogger("forgot-password");

export default function Page() {
  const supabaseAuth = useSupabaseAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [sendingRecoveryMessage, setSendingRecoveryMessage] =
    useState<boolean>(false);

  const sendRecoveryMessage = useCallback(
    async (_email: string) => {
      if (!supabaseAuth.clientLoaded) {
        throw new Error(
          `Supabase auth initialization error. Cannot recover password.`,
        );
      }
      setSendingRecoveryMessage(true);
      try {
        const response = await supabaseAuth.auth.resetPasswordForEmail(_email, {
          redirectTo: `${window.location.origin}/auth/change-password`,
        });
        if (response.error) throw response.error;
        logger.debug({ response }, "Recovery message sent");
        toast(
          `Recovery message sent to ${_email}. After changing your password, you can login here`,
          { type: "success" },
        );
        router.push("/auth/login");
      } catch (err: unknown) {
        logger.error({ err }, "Error sending recovery message");
        const parsedError = await parseError(err);
        toast(parsedError, { type: "error" });
      } finally {
        setSendingRecoveryMessage(false);
      }
    },
    [router, supabaseAuth],
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

          <form
            className={authStyles.form}
            action={() => sendRecoveryMessage(email)}
          >
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
                type="submit"
                className={clsx(buttonStyles.button, buttonStyles.maxWidth20)}
                variant="contained"
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
