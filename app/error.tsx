'use client';

import { useEffect } from 'react';
import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Something went wrong</h1>
        <p className={styles.message}>
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.retryButton}>
            Try again
          </button>
          <button onClick={() => window.location.href = '/'} className={styles.homeButton}>
            Go to Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error.stack && (
          <details className={styles.details}>
            <summary>Error Details</summary>
            <pre className={styles.stack}>{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
