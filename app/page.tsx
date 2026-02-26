"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { useDatasetStore } from "@/lib/stores/dataset-store";
import { useRecentsStore } from "@/lib/stores/recents-store";
import { useChartsStore } from "@/lib/stores/charts-store";
import { buildParsedCSV } from "@/lib/utils";
import type { ParseResult } from "@/lib/types";
import styles from "./page.module.scss";

const FEATURES = [
  {
    icon: "\u26A1",
    title: "Blazing Fast",
    description:
      "WebGL-accelerated rendering handles millions of data points without breaking a sweat.",
  },
  {
    icon: "\uD83D\uDD12",
    title: "100% Private",
    description:
      "Your data never leaves your browser. Zero uploads, zero tracking, zero compromise.",
  },
  {
    icon: "\uD83D\uDCCA",
    title: "Rich Chart Types",
    description:
      "Scatter, bar, line, histogram, box, violin, heatmap \u2014 all interactive and exportable.",
  },
  {
    icon: "\u2699\uFE0F",
    title: "Smart Parsing",
    description:
      "Web Worker-powered CSV parsing with auto-type detection for numbers, dates, and categories.",
  },
] as const;

const STATS = [
  { value: "10+", label: "Chart Types" },
  { value: "1M+", label: "Rows Supported" },
  { value: "0", label: "Data Uploaded" },
  { value: "<1s", label: "Time to Chart" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const setDataset = useDatasetStore((state) => state.setDataset);
  const recents = useRecentsStore((state) => state.recents);
  const addRecent = useRecentsStore((state) => state.addRecent);
  const getCharts = useChartsStore((state) => state.getCharts);

  const processFile = useCallback(
    (file: File) => {
      setIsProcessing(true);
      setError(null);
      setProgress("Starting...");

      Promise.resolve().then(async () => {
        try {
          const worker = new Worker(
            new URL("../workers/csv-parser.worker.ts", import.meta.url),
            { type: "module" }
          );

          worker.postMessage({ file });

          worker.onmessage = (e: MessageEvent<ParseResult>) => {
            const result = e.data;

            if (result.type === "progress") {
              setProgress(result.message);
            } else if (result.type === "success") {
              const parsed = buildParsedCSV(result.data);
              setDataset(parsed);

              const chartCount = getCharts(parsed.signature).length;
              addRecent({
                id: parsed.id,
                fileName: parsed.fileName,
                signature: parsed.signature,
                rowCount: parsed.rowCount,
                columnCount: parsed.columnCount,
                uploadedAt: parsed.uploadedAt,
                chartCount,
              });

              worker.terminate();
              router.push("/workspace");
            } else if (result.type === "error") {
              setError(result.error);
              setIsProcessing(false);
              worker.terminate();
            }
          };

          worker.onerror = (err) => {
            setError("Worker error: " + err.message);
            setIsProcessing(false);
            worker.terminate();
          };
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setIsProcessing(false);
        }
      });
    },
    [router, setDataset, addRecent, getCharts]
  );

  const loadSampleDataset = useCallback(() => {
    Promise.resolve().then(async () => {
      try {
        const response = await fetch("/sample.csv");
        const blob = await response.blob();
        const file = new File([blob], "sample.csv", { type: "text/csv" });
        processFile(file);
      } catch {
        setError("Failed to load sample dataset");
      }
    });
  }, [processFile]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.page}>
      {/* Ambient background glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* ====== HERO ====== */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Open-source &middot; Privacy-first &middot; Browser-based
          </div>
          <h1 className={styles.heroTitle}>
            Turn CSV files into
            <br />
            <span className={styles.heroAccent}>stunning charts</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Drop any CSV file and instantly create interactive, publication-ready
            visualizations. Your data never leaves your browser.
          </p>
          <div className={styles.heroCta}>
            <button
              className={styles.primaryButton}
              onClick={() =>
                document
                  .getElementById("upload-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Visualizing
            </button>
            <button
              className={styles.secondaryButton}
              onClick={loadSampleDataset}
              disabled={isProcessing}
            >
              Try Sample Data
            </button>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className={styles.statsBar} aria-label="Platform statistics">
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ====== UPLOAD ====== */}
      <section
        id="upload-section"
        className={styles.uploadSection}
        aria-label="Upload CSV file"
      >
        <div className={styles.uploadCard}>
          <UploadDropzone
            onFileSelected={processFile}
            disabled={isProcessing}
          />

          {isProcessing && (
            <div className={styles.processing} role="status" aria-live="polite">
              <div className={styles.spinner} />
              <p>{progress}</p>
            </div>
          )}

          {error && (
            <div className={styles.error} role="alert">
              <p>{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className={styles.features} aria-label="Features">
        <h2 className={styles.sectionTitle}>
          Everything you need for data visualization
        </h2>
        <p className={styles.sectionSubtitle}>
          Powerful tools that work entirely in your browser
        </p>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ====== RECENTS ====== */}
      {recents.length > 0 && (
        <section className={styles.recentsSection} aria-label="Recent datasets">
          <h2 className={styles.sectionTitle}>Recent Datasets</h2>
          <div className={styles.recentsList}>
            {recents.map((dataset) => (
              <div key={dataset.id} className={styles.recentCard}>
                <div className={styles.recentHeader}>
                  <h3>{dataset.fileName}</h3>
                  <span className={styles.timestamp}>
                    {formatDate(dataset.uploadedAt)}
                  </span>
                </div>
                <div className={styles.recentStats}>
                  <span>{dataset.rowCount.toLocaleString()} rows</span>
                  <span className={styles.dot}>&middot;</span>
                  <span>{dataset.columnCount} columns</span>
                  {dataset.chartCount > 0 && (
                    <>
                      <span className={styles.dot}>&middot;</span>
                      <span className={styles.chartCount}>
                        {dataset.chartCount} chart
                        {dataset.chartCount !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>
                <p className={styles.recentNote}>
                  Re-upload this file to restore saved charts
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====== CTA ====== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2>Ready to visualize your data?</h2>
          <p>
            No sign-up required. No data leaves your browser. Just drop a CSV and go.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/dashboard" className={styles.ctaLink}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
