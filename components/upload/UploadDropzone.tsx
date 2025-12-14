"use client";

import { useCallback, useState } from "react";
import styles from "./UploadDropzone.module.scss";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function UploadDropzone({
  onFileSelected,
  disabled,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find((f) => f.name.endsWith(".csv"));

      if (csvFile) {
        onFileSelected(csvFile);
      }
    },
    [onFileSelected, disabled]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelected(file);
      }
    };
    input.click();
  }, [onFileSelected, disabled]);

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${
        disabled ? styles.disabled : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className={styles.text}>
          {isDragging
            ? "Drop CSV file here"
            : "Drag & drop CSV file or click to browse"}
        </p>
        <p className={styles.subtext}>Maximum file size: 50MB</p>
      </div>
    </div>
  );
}
