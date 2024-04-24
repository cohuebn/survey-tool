"use client";

import { Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useUserSession } from "../auth/use-user-session";
import { Navbar } from "../navbar/navbar";

export default function Page() {
  const { user, userLoaded, removeAuthenticatedUser } = useUserSession();
  const router = useRouter();

  const logout = useCallback(() => {
    removeAuthenticatedUser();
    router.push("/auth/login");
  }, [removeAuthenticatedUser, router]);

  if (!userLoaded) {
    return <CircularProgress />;
  }

  return (
    <main>
      <Navbar />
    </main>
  );
  return (
    <>
      <Typography variant="h1">Placeholder for home page</Typography>
      <Typography variant="body1">
        Logged in as {user?.email ?? "no one"}
      </Typography>
      <Button variant="contained" onClick={logout}>
        {user ? "Logout" : "Return to login page"}
      </Button>
    </>
  );
}
