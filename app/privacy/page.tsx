import styles from "./page.module.scss";

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: February 2026</p>

        <section className={styles.section}>
          <h2>Overview</h2>
          <p>
            CSV Plot Studio is a client-side data visualization tool. Your data
            never leaves your browser. We are committed to protecting your
            privacy and ensuring your data remains under your control.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data Processing</h2>
          <p>
            All CSV file processing, chart generation, and data analysis happens
            entirely within your web browser using Web Workers. No data is
            uploaded to any server. Your files are parsed locally using the
            PapaParse library and visualized using Plotly.js.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Local Storage</h2>
          <p>
            We use your browser&apos;s localStorage to persist chart configurations
            and recent dataset metadata. This data is stored only on your device
            and can be cleared at any time through your browser settings.
          </p>
          <ul>
            <li>
              <strong>Chart configurations</strong> are saved so they can be
              restored when you re-upload the same dataset.
            </li>
            <li>
              <strong>Recent uploads metadata</strong> (file name, row count,
              column count) is stored for convenience. The actual file data is
              not persisted.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>No Analytics or Tracking</h2>
          <p>
            CSV Plot Studio does not use cookies, analytics services, or any
            form of user tracking. We do not collect personal information,
            usage statistics, or behavioral data.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Third-Party Services</h2>
          <p>
            This application does not communicate with any third-party services.
            All functionality is self-contained within the browser. No external
            API calls are made with your data.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data Security</h2>
          <p>
            Since your data never leaves your browser, it is protected by your
            browser&apos;s built-in security mechanisms. We recommend keeping your
            browser up to date to benefit from the latest security features.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, please open an
            issue on our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
