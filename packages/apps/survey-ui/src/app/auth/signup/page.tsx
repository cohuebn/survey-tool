"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createLogger } from "@survey-tool/core";
import buttonStyles from "@styles/buttons.module.css";
import authStyles from "@styles/auth.module.css";

import { parseError } from "../../errors/parse-error";
import { useSupabaseAuth } from "../../supabase/use-supabase-auth";
import { PasswordTextField } from "../password-text-field";
import { EmailTextField } from "../email-text-field";

const logger = createLogger("signup");

export default function Page() {
  const supabaseAuth = useSupabaseAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [signingUp, setSigningUp] = useState<boolean>(false);

  const passwordMismatch = password !== confirmedPassword;

  const signUp = useCallback(
    async (_email: string, _password: string) => {
      if (!supabaseAuth.clientLoaded) {
        throw new Error(`Supabase auth initialization error. Cannot sign up.`);
      }
      setSigningUp(true);
      try {
        const { error, data } = await supabaseAuth.auth.signUp({
          email: _email,
          password: _password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/login`,
          },
        });
        if (error) throw error;
        logger.info({ error, data });
        toast(
          `Verification email sent to ${_email}. After verifying, you can log in.`,
          { type: "success" },
        );
        router.push("/auth/login");
      } catch (err: unknown) {
        logger.error({ err }, "Error signing up");
        toast(parseError(err), { type: "error" });
      } finally {
        setSigningUp(false);
      }
    },
    [supabaseAuth, router],
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
            We&apos;re glad you&apos;re here!
          </Typography>

          <form
            className={authStyles.form}
            action={() => signUp(email, password)}
          >
            <EmailTextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
                disabled={signingUp || !email || !password || passwordMismatch}
                type="submit"
                className={buttonStyles.button}
                variant="contained"
              >
                Sign up
              </Button>
            </div>
          </form>
          <p className={authStyles.alternateActionLink}>
            Already have an account? <Link href="/auth/login">Login here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
