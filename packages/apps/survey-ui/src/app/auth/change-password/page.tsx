"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createLogger } from "@survey-tool/core";
import { toast } from "react-toastify";
import { clsx } from "clsx";
import authStyles from "@styles/auth.module.css";
import buttonStyles from "@styles/buttons.module.css";
import { AuthSessionMissingError } from "@supabase/supabase-js";

import { parseError } from "../../errors/parse-error";
import { useSupabaseAuth } from "../../supabase/use-supabase-auth";
import { PasswordTextField } from "../password-text-field";

const logger = createLogger("forgot-password");

function handleChangePasswordError(err: unknown) {
  if (err instanceof AuthSessionMissingError) {
    throw new Error(
      "It appears that you have not accessed this page via a password reset link. Please request a password reset from the 'Forgot password' page.",
    );
  }
  throw err;
}

export default function Page() {
  const supabaseAuth = useSupabaseAuth();
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const passwordMismatch = password !== confirmedPassword;

  const changePassword = useCallback(
    async (_password: string) => {
      if (!supabaseAuth.clientLoaded) {
        throw new Error(
          `Supabase auth initialization error. Cannot recover password.`,
        );
      }
      setChangingPassword(true);
      try {
        const response = await supabaseAuth.auth.updateUser(
          { password: _password },
          { emailRedirectTo: `${window.location.origin}/auth/login` },
        );
        if (response.error) handleChangePasswordError(response.error);
        logger.debug({ response }, "Password changed");
        toast("Password changed successfully", { type: "success" });
        router.push("/auth/login");
      } catch (err: unknown) {
        logger.error({ err }, "Error sending password changed message");
        const parsedError = await parseError(err);
        toast(parsedError, { type: "error" });
      } finally {
        setChangingPassword(false);
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
            Change your password
          </Typography>

          <form
            className={authStyles.form}
            action={() => changePassword(password)}
          >
            <PasswordTextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordMismatch}
              helperText={passwordMismatch ? "Passwords do not match" : ""}
            />
            <PasswordTextField
              placeholder="Confirm password"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <div className={buttonStyles.buttons}>
              <Button
                type="submit"
                className={clsx(buttonStyles.button, buttonStyles.maxWidth20)}
                variant="contained"
                disabled={changingPassword || !password || passwordMismatch}
              >
                Change password
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
