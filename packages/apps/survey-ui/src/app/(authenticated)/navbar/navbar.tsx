import { Edit, Insights, Quiz } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Drawer } from "@mui/material";

import { NavbarLink } from "./navbar-link";
import styles from "./styles.module.css";
import { NavbarContext } from "./navbar-context";

export function Navbar() {
  const { open, setOpen } = useContext(NavbarContext);

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <nav className={styles.navbar}>
        <ul className={styles.navbarLinks}>
          <li>
            <NavbarLink
              href="/home"
              icon={<Insights fontSize="large" />}
              text="Survey results"
            />
          </li>
          <li>
            <NavbarLink
              href="/home"
              icon={<Quiz fontSize="large" />}
              text="Take surveys"
            />
          </li>
          <li>
            <NavbarLink
              href="/home"
              icon={<Edit fontSize="large" />}
              text="Author surveys"
            />
          </li>
        </ul>
      </nav>
    </Drawer>
  );
}
