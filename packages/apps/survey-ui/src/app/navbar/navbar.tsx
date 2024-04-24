import { EditNote, Insights, Quiz } from "@mui/icons-material";

import { NavbarLink } from "./navbar-link";
import styles from "./styles.module.css";

export function Navbar() {
  return (
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
            icon={<EditNote fontSize="large" />}
            text="Author surveys"
          />
        </li>
      </ul>
    </nav>
  );
}
