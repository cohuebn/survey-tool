"use client";

import { CircularProgress } from "@mui/material";

import { useUserSession } from "../auth/use-user-session";
import { useUserScopes } from "../auth/use-user-scopes";

import styles from "./styles.module.css";
import { NavbarContextProvider } from "./navbar/navbar-context";
import { AppBar } from "./appbar/appbar";
import { Navbar } from "./navbar/navbar";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { userSession } = useUserSession();
  const { userScopes, userScopesLoaded } = useUserScopes();

  if (!userSession.loggedIn || !userScopesLoaded) {
    return <CircularProgress />;
  }

  return (
    <div>
      <NavbarContextProvider>
        <AppBar />
        <main className={styles.mainContent}>
          <Navbar userScopes={userScopes ?? []} />
          {children}
        </main>
      </NavbarContextProvider>
    </div>
  );
}
