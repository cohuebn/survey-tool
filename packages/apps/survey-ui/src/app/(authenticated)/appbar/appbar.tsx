import {
  Avatar,
  IconButton,
  AppBar as MuiAppBar,
  Tooltip,
} from "@mui/material";
import { useContext } from "react";
import { Menu } from "@mui/icons-material";
import whiteLogo from "@assets/logo-white.png";
import Image from "next/image";
import Link from "next/link";

import { NavbarContext } from "../navbar/navbar-context";
import { UserSessionContext } from "../../auth/user-session-context";

import styles from "./styles.module.css";

export function AppBar() {
  const { user } = useContext(UserSessionContext);
  const { setOpen: setNavbarOpen } = useContext(NavbarContext);

  const userEmailFirstLetter =
    user?.email?.substring(0, 1).toLocaleUpperCase() ?? "no one";

  return (
    <MuiAppBar position="sticky">
      <div className={styles.appHeaderContent}>
        <Tooltip title="Open menu" placement="bottom">
          <IconButton
            color="inherit"
            aria-label="Open menu"
            onClick={() => setNavbarOpen(true)}
          >
            <Menu />
          </IconButton>
        </Tooltip>
        <Link className={styles.branding} href="/home">
          <Image src={whiteLogo} alt="DocVoice logo" className={styles.logo} />
          <span>DocVoice</span>
        </Link>
        <Avatar>{userEmailFirstLetter}</Avatar>
      </div>
    </MuiAppBar>
  );
}
