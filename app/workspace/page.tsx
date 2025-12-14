"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDatasetStore } from "@/lib/stores/dataset-store";
import { useChartsStore } from "@/lib/stores/charts-store";
import { DatasetSummary } from "@/components/workspace/DatasetSummary";
import { ChartGrid } from "@/components/workspace/ChartGrid";
import { ChartEditor } from "@/components/workspace/ChartEditor";
import { DataTable } from "@/components/workspace/DataTable";
import type { ChartConfig } from "@/lib/types";
import styles from "./page.module.scss";

// Empty array constant to avoid creating new references
const EMPTY_CHARTS: never[] = [];

export default function WorkspacePage() {
  const router = useRouter();
  const dataset = useDatasetStore((state) => state.dataset);
  const datasetSignature = dataset?.signature || "";

  // Use a stable selector that returns the exact array reference from the store
  const chartsRecord = useChartsStore((state) => state.charts);
  const charts = chartsRecord[datasetSignature] || EMPTY_CHARTS;

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);

  useEffect(() => {
    if (!dataset) {
      router.push("/");
    }
  }, [dataset, router]);

  if (!dataset) {
    return null;
  }

  const handleAddChart = () => {
    setEditingChart(null);
    setIsEditorOpen(true);
  };

  const handleEditChart = (chart: ChartConfig) => {
    setEditingChart(chart);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingChart(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </button>
          <h1>Workspace</h1>
        </div>
      </header>

      <main className={styles.main}>
        <DatasetSummary dataset={dataset} />

        <section className={styles.chartsSection}>
          <div className={styles.chartsSectionHeader}>
            <h2>Charts</h2>
            <button className={styles.addButton} onClick={handleAddChart}>
              + Add Chart
            </button>
          </div>

          <ChartGrid
            dataset={dataset}
            charts={charts}
            onEditChart={handleEditChart}
          />
        </section>

        <section className={styles.previewSection}>
          <h2>Data Preview ({dataset.rowCount.toLocaleString()} rows)</h2>
          <DataTable headers={dataset.headers} rows={dataset.rows} />
        </section>
      </main>

      {isEditorOpen && (
        <ChartEditor
          dataset={dataset}
          chart={editingChart}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
