"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DataTable.module.scss";

interface DataTableProps {
  headers: string[];
  rows: string[][];
  pageSize?: number;
}

export function DataTable({ headers, rows, pageSize = 300 }: DataTableProps) {
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleRows = useMemo(
    () => rows.slice(0, page * pageSize),
    [rows, page, pageSize]
  );

  // Reset page when rows change (filters applied)
  useEffect(() => {
    setPage(1);
  }, [rows]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setPage((p) => {
            const next = p + 1;
            const maxPages = Math.ceil(rows.length / pageSize);
            return Math.min(next, maxPages);
          });
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rows.length, pageSize]);

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={sentinelRef} className={styles.sentinel}>
        <div className={styles.loadingIndicator}>
          {visibleRows.length < rows.length ? (
            <span>Loading more rows...</span>
          ) : (
            <span>Showing all {rows.length.toLocaleString()} rows</span>
          )}
        </div>
      </div>
    </div>
  );
}
