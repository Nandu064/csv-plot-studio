import Link from "next/link";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.brand}>CSV Plot Studio</span>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} &middot; All rights reserved
          </span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>

        <div className={styles.right}>
          <span className={styles.tech}>
            Built with Next.js, Plotly.js &amp; PapaParse
          </span>
        </div>
      </div>
    </footer>
  );
}
