import { PREVIEW_ROWS } from "@/lib/constants/limits";
import type { ParsedCSV } from "@/lib/types";
import styles from "./DataPreview.module.scss";

interface DataPreviewProps {
  dataset: ParsedCSV;
}

export function DataPreview({ dataset }: DataPreviewProps) {
  const previewRows = dataset.rows.slice(0, PREVIEW_ROWS);
  const hasMore = dataset.rowCount > PREVIEW_ROWS;

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rowNumber}>#</th>
              {dataset.headers.map((header, index) => (
                <th key={index}>
                  <div className={styles.headerContent}>
                    <span>{header}</span>
                    <span className={styles.columnKind}>
                      {dataset.columns[index]?.kind}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className={styles.rowNumber}>{rowIndex + 1}</td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className={styles.footer}>
          Showing first {PREVIEW_ROWS} of {dataset.rowCount.toLocaleString()}{" "}
          rows
        </div>
      )}
    </div>
  );
}
