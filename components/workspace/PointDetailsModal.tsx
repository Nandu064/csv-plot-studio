"use client";

import { Portal } from "@/components/ui/Portal";
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
  // Find product name - look for common name columns or use first value
  const getProductName = () => {
    const nameColumns = [
      "Product",
      "Name",
      "Product Name",
      "Title",
      "Item",
      "Item Name",
    ];
    for (const col of nameColumns) {
      const index = headers.findIndex(
        (h) => h.toLowerCase() === col.toLowerCase()
      );
      if (index !== -1 && row[index]) {
        return row[index];
      }
    }
    // Fallback to first column if it's not a numeric ID
    if (row[0] && isNaN(Number(row[0]))) {
      return row[0];
    }
    return "Point Details";
  };

  // Capitalize first letter of a string
  const capitalizeFirst = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Portal>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h3 className={styles.title}>{getProductName()}</h3>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={styles.content}>
            <table className={styles.table}>
              <tbody>
                {headers.map((header, i) => (
                  <tr
                    key={i}
                    className={
                      highlightColumns.includes(header)
                        ? styles.highlighted
                        : ""
                    }
                  >
                    <td className={styles.columnName}>
                      {capitalizeFirst(header)}
                    </td>
                    <td className={styles.value}>{capitalizeFirst(row[i])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Portal>
  );
}
