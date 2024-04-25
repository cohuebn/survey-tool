import Link from "next/link";
import { ReactNode } from "react";

import styles from "./styles.module.css";

type NavbarLinkProps = {
  href: string;
  icon: ReactNode;
  text: string;
};

export function NavbarLink({ href, icon, text }: NavbarLinkProps) {
  return (
    <Link className={styles.navbarLink} href={href}>
      {icon}
      {text}
    </Link>
  );
}
