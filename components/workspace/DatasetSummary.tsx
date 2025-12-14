import type { ParsedCSV } from "@/lib/types";
import styles from "./DatasetSummary.module.scss";

interface DatasetSummaryProps {
  dataset: ParsedCSV;
}

export function DatasetSummary({ dataset }: DatasetSummaryProps) {
  const getColumnKindLabel = (kind: string) => {
    const labels: Record<string, string> = {
      number: "Numeric",
      date: "Date",
      text: "Text",
      boolean: "Boolean",
      mixed: "Mixed",
    };
    return labels[kind] || kind;
  };

  const columnsByKind = dataset.columns.reduce((acc, col) => {
    acc[col.kind] = (acc[col.kind] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{dataset.fileName}</h2>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Rows</span>
          <span className={styles.value}>
            {dataset.rowCount.toLocaleString()}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Columns</span>
          <span className={styles.value}>{dataset.columnCount}</span>
        </div>
        {Object.entries(columnsByKind).map(([kind, count]) => (
          <div key={kind} className={styles.stat}>
            <span className={styles.label}>{getColumnKindLabel(kind)}</span>
            <span className={styles.value}>{count}</span>
          </div>
        ))}
      </div>

      {dataset.modifications.length > 0 && (
        <div className={styles.modifications}>
          <h3>Data Modifications</h3>
          <ul>
            {dataset.modifications.map((mod, index) => (
              <li key={index}>{mod}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
