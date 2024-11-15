"use client";

import { Edit, Insights, PendingActions, Quiz } from "@mui/icons-material";
import { useCallback, useContext } from "react";
import { Drawer, useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";

import { adminScope, authorScope } from "../../auth/scopes";

import { NavbarLink } from "./navbar-link";
import styles from "./styles.module.css";
import { NavbarContext } from "./navbar-context";

type NavbarProps = {
  userScopes: string[];
};

export function Navbar({ userScopes }: NavbarProps) {
  const { open, setOpen } = useContext(NavbarContext);
  const activeRoute = usePathname();

  const isActive = useCallback(
    (route: string) => route === activeRoute,
    [activeRoute],
  );

  // Not my favorite thing, but it's the only way I've found to style
  // the drawer's nested paper control position relative to the app bar.
  const onLargeScreen = useMediaQuery("(min-width: 1200px)");
  const largeScreenNavbarStyle = onLargeScreen
    ? {
        [`& .MuiDrawer-paper`]: { top: "5.5rem" },
      }
    : undefined;

  return (
    <Drawer
      variant={onLargeScreen ? "permanent" : "temporary"}
      open={open}
      onClose={() => setOpen(false)}
      sx={largeScreenNavbarStyle}
      className={styles.navbarDrawer}
    >
      <nav className={styles.navbar}>
        <ul className={styles.navbarLinks}>
          <li>
            <NavbarLink
              href="/results"
              icon={<Insights fontSize="large" />}
              text="Survey results"
              active={isActive("/results")}
            />
          </li>
          <li>
            <NavbarLink
              href="/surveys"
              icon={<Quiz fontSize="large" />}
              text="Take surveys"
              active={isActive("/surveys")}
            />
          </li>
          {userScopes.includes(authorScope) ? (
            <li>
              <NavbarLink
                href="/authoring"
                icon={<Edit fontSize="large" />}
                text="Edit surveys"
                active={isActive("/authoring")}
              />
            </li>
          ) : null}
          {userScopes.includes(adminScope) ? (
            <li>
              <NavbarLink
                href="/users/needing-validation"
                icon={<PendingActions fontSize="large" />}
                text="Validate new users"
                active={isActive("/users/needing-validation")}
              />
            </li>
          ) : null}
        </ul>
      </nav>
    </Drawer>
  );
}
