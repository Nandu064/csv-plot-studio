"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { useDatasetStore } from "@/lib/stores/dataset-store";
import { useRecentsStore } from "@/lib/stores/recents-store";
import { useChartsStore } from "@/lib/stores/charts-store";
import { buildParsedCSV } from "@/lib/utils";
import type { ParseResult } from "@/lib/types";
import styles from "./page.module.scss";

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

      // Wrap async operation to prevent React Suspense warnings
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

              // Add to recents
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
    // Wrap async operation to prevent React Suspense warnings
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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/logo.svg" alt="CSV Plot Studio" width={40} height={40} />
          <h1>CSV Plot Studio</h1>
        </div>
        <p className={styles.subtitle}>
          Powerful CSV visualization tool powered by Plotly.js
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.uploadSection}>
          <h2>Upload Dataset</h2>
          <UploadDropzone
            onFileSelected={processFile}
            disabled={isProcessing}
          />

          {isProcessing && (
            <div className={styles.processing}>
              <div className={styles.spinner} />
              <p>{progress}</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.sampleButton}>
            <button onClick={loadSampleDataset} disabled={isProcessing}>
              Try Sample Dataset
            </button>
          </div>
        </section>

        {recents.length > 0 && (
          <section className={styles.recentsSection}>
            <h2>Recent Datasets</h2>
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
                    <span>•</span>
                    <span>{dataset.columnCount} columns</span>
                    {dataset.chartCount > 0 && (
                      <>
                        <span>•</span>
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
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js, Plotly.js, and PapaParse</p>
      </footer>
    </div>
  );
}
