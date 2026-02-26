"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VIRTUAL_TABLE_ROW_HEIGHT, VIRTUAL_TABLE_OVERSCAN } from "@/lib/constants/limits";
import styles from "./DataTable.module.scss";

interface DataTableProps {
  headers: string[];
  rows: string[][];
}

export function DataTable({ headers, rows }: DataTableProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  const rowHeight = VIRTUAL_TABLE_ROW_HEIGHT;
  const overscan = VIRTUAL_TABLE_OVERSCAN;

  // Calculate virtual window
  const totalHeight = rows.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 2 * overscan;
  const endIndex = Math.min(rows.length, startIndex + visibleCount);

  const visibleRows = useMemo(
    () => rows.slice(startIndex, endIndex),
    [rows, startIndex, endIndex]
  );

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset scroll on data change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [rows]);

  const offsetY = startIndex * rowHeight;

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper} ref={containerRef} onScroll={handleScroll}>
        <div style={{ height: totalHeight + 40, position: "relative" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleRows.map((row, i) => (
                <tr key={startIndex + i} style={{ height: rowHeight }}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.sentinel}>
        <div className={styles.loadingIndicator}>
          <span>
            {rows.length.toLocaleString()} rows total
          </span>
        </div>
      </div>
    </div>
  );
}
