"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Portal } from "@/components/ui/Portal";
import { useChartsStore } from "@/lib/stores/charts-store";
import { CHART_SAMPLING_THRESHOLD } from "@/lib/constants/limits";
import type { ParsedCSV, ChartConfig, ChartType } from "@/lib/types";
import styles from "./ChartEditor.module.scss";

interface ChartEditorProps {
  dataset: ParsedCSV;
  chart: ChartConfig | null;
  onClose: () => void;
}

export function ChartEditor({ dataset, chart, onClose }: ChartEditorProps) {
  const addChart = useChartsStore((state) => state.addChart);
  const updateChart = useChartsStore((state) => state.updateChart);

  const [type, setType] = useState<ChartType>(chart?.type || "scatter");
  const [title, setTitle] = useState(chart?.title || "");
  const [xColumn, setXColumn] = useState(
    chart?.xColumn || dataset.headers[0] || ""
  );
  const [yColumns, setYColumns] = useState<string[]>(
    chart?.yColumns || [dataset.headers[1] || ""]
  );
  const [zColumn, setZColumn] = useState(chart?.zColumn || "");
  const [colorByColumn, setColorByColumn] = useState(
    chart?.colorByColumn || ""
  );
  const [samplingEnabled, setSamplingEnabled] = useState(
    chart?.samplingEnabled ?? dataset.rowCount > CHART_SAMPLING_THRESHOLD
  );
  const [maxPoints, setMaxPoints] = useState(
    chart?.maxPoints || CHART_SAMPLING_THRESHOLD
  );

  const handleSave = () => {
    const config: ChartConfig = {
      id: chart?.id || nanoid(),
      type,
      title,
      xColumn,
      yColumns,
      zColumn: zColumn || undefined,
      colorByColumn: colorByColumn || undefined,
      samplingEnabled,
      maxPoints: samplingEnabled ? maxPoints : undefined,
      datasetSignature: dataset.signature,
    };

    if (chart) {
      updateChart(dataset.signature, chart.id, config);
    } else {
      addChart(dataset.signature, config);
    }

    onClose();
  };

  const handleAddYColumn = () => {
    const availableColumns = dataset.headers.filter(
      (h) => !yColumns.includes(h) && h !== xColumn
    );
    if (availableColumns.length > 0) {
      setYColumns([...yColumns, availableColumns[0]]);
    }
  };

  const handleRemoveYColumn = (index: number) => {
    setYColumns(yColumns.filter((_, i) => i !== index));
  };

  const handleYColumnChange = (index: number, value: string) => {
    const newYColumns = [...yColumns];
    newYColumns[index] = value;
    setYColumns(newYColumns);
  };

  const needs3D = type === "scatter3d" || type === "surface";
  const needsYColumn = type !== "histogram";

  return (
    <Portal>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>{chart ? "Edit Chart" : "New Chart"}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.field}>
              <label>Chart Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ChartType)}
              >
                <option value="scatter">Scatter</option>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="histogram">Histogram</option>
                <option value="box">Box</option>
                <option value="violin">Violin</option>
                <option value="scatter3d">3D Scatter</option>
                <option value="surface">Surface</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chart title"
              />
            </div>

            <div className={styles.field}>
              <label>X Column</label>
              <select
                value={xColumn}
                onChange={(e) => setXColumn(e.target.value)}
              >
                {dataset.headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>

            {needsYColumn && (
              <div className={styles.field}>
                <div className={styles.fieldHeader}>
                  <label>Y Column(s)</label>
                  {type !== "box" &&
                    type !== "scatter3d" &&
                    type !== "surface" && (
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={handleAddYColumn}
                        disabled={yColumns.length >= dataset.headers.length - 1}
                      >
                        + Add Series
                      </button>
                    )}
                </div>
                {yColumns.map((yCol, index) => (
                  <div key={index} className={styles.multiField}>
                    <select
                      value={yCol}
                      onChange={(e) =>
                        handleYColumnChange(index, e.target.value)
                      }
                    >
                      {dataset.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                    {yColumns.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveYColumn(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {needs3D && (
              <div className={styles.field}>
                <label>Z Column</label>
                <select
                  value={zColumn}
                  onChange={(e) => setZColumn(e.target.value)}
                >
                  <option value="">Select column</option>
                  {dataset.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.field}>
              <label>Color By (Optional)</label>
              <select
                value={colorByColumn}
                onChange={(e) => setColorByColumn(e.target.value)}
              >
                <option value="">None</option>
                {dataset.headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={samplingEnabled}
                  onChange={(e) => setSamplingEnabled(e.target.checked)}
                />
                Enable sampling
                {dataset.rowCount > CHART_SAMPLING_THRESHOLD && (
                  <span className={styles.hint}>
                    (recommended for {dataset.rowCount.toLocaleString()} rows)
                  </span>
                )}
              </label>
            </div>

            {samplingEnabled && (
              <div className={styles.field}>
                <label>Max Points</label>
                <input
                  type="number"
                  value={maxPoints}
                  onChange={(e) =>
                    setMaxPoints(
                      parseInt(e.target.value) || CHART_SAMPLING_THRESHOLD
                    )
                  }
                  min="100"
                  max="100000"
                  step="1000"
                />
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={
                !xColumn ||
                (needsYColumn && yColumns.length === 0) ||
                (needs3D && !zColumn)
              }
            >
              {chart ? "Update" : "Create"} Chart
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
