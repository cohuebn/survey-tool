"use client";

import { CircularProgress } from "@mui/material";

import { useUserScopes } from "../../auth/use-user-scopes";
import { authorScope } from "../../auth/scopes";

type AuthoringLayoutProps = {
  children: React.ReactNode;
};

export default function AuthoringLayout({ children }: AuthoringLayoutProps) {
  const { userScopes, userScopesLoaded } = useUserScopes();

  if (!userScopesLoaded) {
    return <CircularProgress />;
  }
  if (!userScopes?.includes(authorScope)) {
    throw new Error(
      "User does not have permission to view survey authoring section.",
    );
  }

  return <>{children}</>;
}
