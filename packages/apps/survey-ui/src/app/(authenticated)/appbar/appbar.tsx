import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Logout, Menu as MenuIcon, Person } from "@mui/icons-material";
import whiteLogo from "@assets/logo-white.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { NavbarContext } from "../navbar/navbar-context";
import { UserSessionContext } from "../../auth/user-session-context";

import styles from "./styles.module.css";

export function AppBar() {
  const { user, removeAuthenticatedUser } = useContext(UserSessionContext);
  const { setOpen: setNavbarOpen } = useContext(NavbarContext);
  const [profileAnchorElement, setProfileAnchorElement] =
    useState<null | HTMLElement>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    router.push("/auth/login");
    removeAuthenticatedUser();
  }, [removeAuthenticatedUser, router]);

  const userEmailFirstLetter =
    user?.email?.substring(0, 1).toLocaleUpperCase() ?? "no one";

  const onProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorElement(event.currentTarget);
  };

  const onProfileClose = () => {
    setProfileAnchorElement(null);
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  // Not my favorite thing, but it's the only way I've found to style
  // the app bar above the nav menu (drawer).
  const onLargeScreen = useMediaQuery("(min-width: 1200px)");
  const appBarStyle = onLargeScreen
    ? { zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }
    : undefined;

  return (
    <MuiAppBar
      position="sticky"
      // App bar should be above the nav menu (drawer)
      sx={appBarStyle}
    >
      <div className={styles.appHeaderContent}>
        <Tooltip title="Open menu" placement="bottom">
          <IconButton
            className={styles.toggleNavbar}
            color="inherit"
            aria-label="Open menu"
            onClick={() => setNavbarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Link className={styles.branding} href="/home">
          <Image src={whiteLogo} alt="DocVoice logo" className={styles.logo} />
          <span>DocVoice</span>
        </Link>
        <IconButton onClick={onProfileClick}>
          <Avatar className={styles.userAvatar}>{userEmailFirstLetter}</Avatar>
        </IconButton>
        <Menu
          anchorEl={profileAnchorElement}
          open={Boolean(profileAnchorElement)}
          onClose={onProfileClose}
        >
          <MenuItem disabled>Logged in as {user?.email}</MenuItem>
          <MenuItem onClick={goToProfile}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </MuiAppBar>
  );
}
