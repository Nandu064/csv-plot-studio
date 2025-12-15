"use client";

import { useState, useEffect } from "react";
import styles from "./ChartLoader.module.scss";

interface ChartLoaderProps {
  pointCount?: number;
}

export function ChartLoader({ pointCount }: ChartLoaderProps) {
  const [message, setMessage] = useState("Loading chart...");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(seconds);

      // Dynamic messages based on time elapsed
      if (seconds < 2) {
        setMessage("Loading chart...");
      } else if (seconds < 4) {
        setMessage("Building visualization...");
      } else if (seconds < 6) {
        if (pointCount && pointCount > 10000) {
          setMessage(
            `Processing ${pointCount.toLocaleString()} data points...`
          );
        } else {
          setMessage("Almost there...");
        }
      } else if (seconds < 10) {
        setMessage("This is taking longer than usual...");
      } else {
        setMessage("Still working on it... hang tight!");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pointCount]);

  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      <p className={styles.message}>{message}</p>
      {elapsed > 3 && (
        <p className={styles.hint}>
          {pointCount && pointCount > 10000
            ? "Tip: Enable sampling for faster rendering"
            : "Tip: Large datasets may take a moment"}
        </p>
      )}
    </div>
  );
}
