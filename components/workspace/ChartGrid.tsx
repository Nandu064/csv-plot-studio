"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { PlotlyChart } from "@/components/plot/PlotlyChart";
import { useChartsStore } from "@/lib/stores/charts-store";
import { sampleRows } from "@/lib/utils/sampling";
import { CHART_SAMPLING_THRESHOLD } from "@/lib/constants/limits";
import { buildChartData } from "@/lib/utils/chart-builders";
import { PointDetailsModal } from "./PointDetailsModal";
import { confirmDanger, toastSuccess, toastError } from "@/lib/ui/alerts";
import type { ParsedCSV, ChartSpec, ChartConfig } from "@/lib/types";
import styles from "./ChartGrid.module.scss";

interface ChartGridProps {
  dataset: ParsedCSV;
  charts: ChartSpec[];
  onEditChart: (chart: ChartConfig) => void;
}

export function ChartGrid({ dataset, charts, onEditChart }: ChartGridProps) {
  const deleteChart = useChartsStore((state) => state.deleteChart);

  const handleDelete = useCallback(
    (chartId: string) => {
      Promise.resolve()
        .then(async () => {
          const confirmed = await confirmDanger(
            "Delete Chart?",
            "This action cannot be undone."
          );

          if (confirmed) {
            deleteChart(dataset.signature, chartId);
            toastSuccess("Chart deleted successfully");
          }
        })
        .catch((error) => {
          console.error("Delete failed:", error);
          toastError("Failed to delete chart");
        });
    },
    [deleteChart, dataset.signature]
  );

  const handleExport = useCallback((chartId: string) => {
    Promise.resolve().then(async () => {
      try {
        const element = document.querySelector(
          `[data-chart-id="${chartId}"]`
        ) as HTMLElement;
        if (!element) return;

        const Plotly = await import("plotly.js-dist-min");
        const gd = element.querySelector(".js-plotly-plot") as HTMLElement;
        if (!gd) return;

        await Plotly.downloadImage(gd, {
          format: "png",
          width: 1200,
          height: 800,
          filename: `chart-${chartId}`,
        });

        toastSuccess("Chart exported successfully");
      } catch (error) {
        console.error("Export failed:", error);
        toastError("Failed to export chart");
      }
    });
  }, []);

  if (charts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>
          No charts yet. Click &quot;Add Chart&quot; to create your first
          visualization.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {charts.map((chart) => (
        <MemoizedChartCard
          key={chart.id}
          chart={chart}
          dataset={dataset}
          onEdit={() => onEditChart(chart)}
          onDelete={() => handleDelete(chart.id)}
          onExport={() => handleExport(chart.id)}
        />
      ))}
    </div>
  );
}

interface ChartCardProps {
  chart: ChartSpec;
  dataset: ParsedCSV;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

const WEBGL_THRESHOLD = 20_000;

function ChartCard({
  chart,
  dataset,
  onEdit,
  onDelete,
  onExport,
}: ChartCardProps) {
  const [selectedPoint, setSelectedPoint] = useState<string[] | null>(null);

  // Memoize sampling to avoid recomputing on every render
  const { dataRows, shouldSample, maxPoints } = useMemo(() => {
    const _shouldSample =
      chart.samplingEnabled && dataset.rowCount > CHART_SAMPLING_THRESHOLD;
    const _maxPoints = chart.maxPoints || CHART_SAMPLING_THRESHOLD;
    const _dataRows = _shouldSample
      ? sampleRows(dataset.rows, _maxPoints)
      : dataset.rows;
    return { dataRows: _dataRows, shouldSample: _shouldSample, maxPoints: _maxPoints };
  }, [chart.samplingEnabled, chart.maxPoints, dataset.rows, dataset.rowCount]);

  // Memoize chart data computation - this is the main perf bottleneck
  const { data, layout } = useMemo(
    () => buildChartData(dataset, chart, dataRows),
    [dataset, chart, dataRows]
  );

  // Use WebGL traces for large datasets to prevent UI freeze
  const optimizedData = useMemo(() => {
    if (dataRows.length < WEBGL_THRESHOLD) return data;
    return data.map((trace) => {
      if (trace.type === "scatter") {
        return { ...trace, type: "scattergl" as const };
      }
      return trace;
    });
  }, [data, dataRows.length]);

  const handlePointClick = useCallback((row: string[]) => {
    setSelectedPoint(row);
  }, []);

  const highlightColumns = useMemo(
    () =>
      [chart.xColumn, ...chart.yColumns, chart.zColumn, chart.colorByColumn].filter(
        Boolean
      ) as string[],
    [chart.xColumn, chart.yColumns, chart.zColumn, chart.colorByColumn]
  );

  return (
    <div className={styles.card} data-chart-id={chart.id}>
      <div className={styles.cardHeader}>
        <h3>{chart.title || "Untitled Chart"}</h3>
        <div className={styles.cardActions}>
          <button onClick={onExport} title="Export as PNG">
            Export
          </button>
          <button onClick={onEdit} title="Edit">
            Edit
          </button>
          <button onClick={onDelete} title="Delete" className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <PlotlyChart
          data={optimizedData}
          layout={layout}
          onPointClick={handlePointClick}
          pointCount={dataRows.length}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ["lasso2d", "select2d"],
          }}
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
        />
      </div>
      {shouldSample && (
        <div className={styles.samplingNote}>
          Showing {maxPoints.toLocaleString()} of{" "}
          {dataset.rowCount.toLocaleString()} points
        </div>
      )}

      {selectedPoint && (
        <PointDetailsModal
          headers={dataset.headers}
          row={selectedPoint}
          onClose={() => setSelectedPoint(null)}
          highlightColumns={highlightColumns}
        />
      )}
    </div>
  );
}

const MemoizedChartCard = memo(ChartCard);
