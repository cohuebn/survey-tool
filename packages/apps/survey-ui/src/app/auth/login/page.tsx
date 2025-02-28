"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { useCallback, useState } from "react";
import { createLogger } from "@survey-tool/core";
import { toast } from "react-toastify";
import authStyles from "@styles/auth.module.css";
import buttonStyles from "@styles/buttons.module.css";
import { useRouter } from "next/navigation";

import { parseError } from "../../errors/parse-error";
import { useUserSession } from "../use-user-session";
import { toUserSession } from "../user-session";
import { useSupabaseAuth } from "../../supabase/use-supabase-auth";
import { PasswordTextField } from "../password-text-field";
import { EmailTextField } from "../email-text-field";

const logger = createLogger("login");

export default function Page() {
  const supabaseAuth = useSupabaseAuth();
  const router = useRouter();
  const { setUserSession } = useUserSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signingIn, setSigningIn] = useState<boolean>(false);

  const signIn = useCallback(
    async (_email: string, _password: string) => {
      if (!supabaseAuth.clientLoaded) {
        throw new Error(`Supabase auth initialization error. Cannot sign in.`);
      }
      setSigningIn(true);
      try {
        if (!_email || !_password) {
          throw new Error("Email and password are required");
        }
        const { data, error } = await supabaseAuth.auth.signInWithPassword({
          email: _email,
          password: _password,
        });
        if (error) throw error;
        if (!data.user.confirmed_at) {
          throw new Error(
            "Please verify your email address before logging in. Check your inbox for a verification email.",
          );
        }
        setUserSession(toUserSession(data.user, data.session));
        router.push("/home");
      } catch (err: unknown) {
        logger.error({ err }, "Error logging in");
        const parsedError = await parseError(err);
        toast(parsedError, { type: "error" });
      } finally {
        setSigningIn(false);
      }
    },
    [router, setUserSession, supabaseAuth],
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

          <form
            className={authStyles.form}
            action={() => signIn(email, password)}
          >
            <EmailTextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordTextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link href="/auth/forgot-password">Forgot your password?</Link>
            <div className={buttonStyles.buttons}>
              <Button
                className={buttonStyles.button}
                variant="contained"
                type="submit"
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
