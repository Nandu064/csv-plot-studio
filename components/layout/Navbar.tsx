"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./Navbar.module.scss";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="CSV Plot Studio home">
          <div className={styles.logoMark}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2" y="14" width="4" height="8" rx="1" fill="#818cf8" />
              <rect x="8" y="10" width="4" height="12" rx="1" fill="#a78bfa" />
              <rect x="14" y="6" width="4" height="16" rx="1" fill="#f472b6" />
              <rect x="20" y="2" width="4" height="20" rx="1" fill="#fb923c" opacity="0.7" />
            </svg>
          </div>
          <span className={styles.brandText}>CSV Plot Studio</span>
        </Link>

        <div className={styles.links}>
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
