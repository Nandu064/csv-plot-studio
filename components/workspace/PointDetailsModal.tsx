"use client";

import styles from "./PointDetailsModal.module.scss";

interface PointDetailsModalProps {
  headers: string[];
  row: string[];
  onClose: () => void;
  highlightColumns?: string[];
}

export function PointDetailsModal({
  headers,
  row,
  onClose,
  highlightColumns = [],
}: PointDetailsModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Point Details</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Column</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header, i) => (
                <tr
                  key={i}
                  className={
                    highlightColumns.includes(header) ? styles.highlighted : ""
                  }
                >
                  <td className={styles.columnName}>{header}</td>
                  <td className={styles.value}>{row[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
