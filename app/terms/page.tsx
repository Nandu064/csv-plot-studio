import styles from "./page.module.scss";

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated: February 2026</p>

        <section className={styles.section}>
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using CSV Plot Studio, you accept and agree to be
            bound by these Terms of Service. If you do not agree with any part
            of these terms, you may not use the application.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Description of Service</h2>
          <p>
            CSV Plot Studio is a free, open-source, browser-based tool for
            visualizing CSV data. The application runs entirely in your web
            browser and does not require an account or server connection.
          </p>
        </section>

        <section className={styles.section}>
          <h2>User Responsibilities</h2>
          <ul>
            <li>
              You are responsible for the data you upload and the charts you
              create.
            </li>
            <li>
              You should not upload files containing sensitive, classified, or
              personally identifiable information unless you understand that the
              data is processed locally in your browser.
            </li>
            <li>
              You are responsible for backing up any chart configurations or
              data that is important to you.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Intellectual Property</h2>
          <p>
            Charts and visualizations you create using CSV Plot Studio are
            yours. The application itself, including its source code, design,
            and documentation, is provided under its respective open-source
            license.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Disclaimer of Warranties</h2>
          <p>
            CSV Plot Studio is provided &quot;as is&quot; without warranty of
            any kind, express or implied. We do not guarantee that the
            application will be error-free, uninterrupted, or suitable for any
            particular purpose.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Limitation of Liability</h2>
          <p>
            In no event shall the creators of CSV Plot Studio be liable for
            any damages arising from the use or inability to use the
            application, including but not limited to data loss, incorrect
            visualizations, or browser compatibility issues.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data Handling</h2>
          <p>
            All data processing occurs locally in your browser. We do not
            store, transmit, or have access to any data you upload. Browser
            localStorage is used only for saving chart configurations and
            metadata.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes
            will be reflected on this page with an updated revision date.
            Continued use of the application constitutes acceptance of the
            modified terms.
          </p>
        </section>
      </div>
    </div>
  );
}
