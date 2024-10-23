import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

type NavbarLinkProps = {
  href: string;
  icon: ReactNode;
  text: string;
  active?: boolean;
};

export function NavbarLink({ href, icon, text, active }: NavbarLinkProps) {
  return (
    <Link
      className={clsx(styles.navbarLink, { [styles.active]: active })}
      href={href}
    >
      {icon}
      {text}
    </Link>
  );
}
