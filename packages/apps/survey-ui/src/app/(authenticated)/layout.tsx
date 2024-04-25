"use client";

import { CircularProgress } from "@mui/material";

import { useUserSession } from "../auth/use-user-session";

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
  const { userLoaded } = useUserSession();

  if (!userLoaded) {
    return <CircularProgress />;
  }

  return (
    <div>
      <NavbarContextProvider>
        <AppBar />
        <main className={styles.mainContent}>
          <Navbar />
          {children}
        </main>
      </NavbarContextProvider>
    </div>
  );
}
