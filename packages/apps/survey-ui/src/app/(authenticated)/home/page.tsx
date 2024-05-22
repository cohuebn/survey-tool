"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";

import { useUserSession } from "../../auth/use-user-session";

export default function Page() {
  const { userSession } = useUserSession();

  if (!userSession.loggedIn) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Placeholder for the home page</Typography>
    </div>
  );
}
