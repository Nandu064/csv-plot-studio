import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryLink}>
            Go Home
          </Link>
          <Link href="/dashboard" className={styles.secondaryLink}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
