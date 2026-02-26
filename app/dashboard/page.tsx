"use client";

import Link from "next/link";
import { useRecentsStore } from "@/lib/stores/recents-store";
import { useChartsStore } from "@/lib/stores/charts-store";
import styles from "./page.module.scss";

const STAT_COLORS = [
  { bg: "rgba(129, 140, 248, 0.1)", border: "rgba(129, 140, 248, 0.2)", color: "#818cf8" },
  { bg: "rgba(52, 211, 153, 0.1)", border: "rgba(52, 211, 153, 0.2)", color: "#34d399" },
  { bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.2)", color: "#fbbf24" },
  { bg: "rgba(244, 114, 182, 0.1)", border: "rgba(244, 114, 182, 0.2)", color: "#f472b6" },
];

const BAR_COLORS = [
  "linear-gradient(90deg, #818cf8 0%, #a78bfa 100%)",
  "linear-gradient(90deg, #34d399 0%, #6ee7b7 100%)",
  "linear-gradient(90deg, #fbbf24 0%, #fcd34d 100%)",
  "linear-gradient(90deg, #f472b6 0%, #f9a8d4 100%)",
  "linear-gradient(90deg, #fb923c 0%, #fdba74 100%)",
  "linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)",
];

export default function DashboardPage() {
  const recents = useRecentsStore((s) => s.recents);
  const chartsRecord = useChartsStore((s) => s.charts);

  const totalCharts = Object.values(chartsRecord).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const totalDatasets = recents.length;
  const totalRows = recents.reduce((sum, r) => sum + r.rowCount, 0);
  const chartTypes = Object.values(chartsRecord)
    .flat()
    .reduce(
      (acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  const formatRows = (n: number) => {
    if (n > 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n > 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  const stats = [
    { label: "Datasets", value: totalDatasets },
    { label: "Charts Created", value: totalCharts },
    { label: "Total Rows", value: formatRows(totalRows) },
    { label: "Chart Types", value: Object.keys(chartTypes).length },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>Dashboard</h1>
        <p className={styles.subtitle}>
          Overview of your datasets and visualizations
        </p>
      </header>

      {/* Stat Cards */}
      <div className={styles.statsGrid} role="list" aria-label="Statistics">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.statCard}
            role="listitem"
            style={{
              background: STAT_COLORS[i].bg,
              borderColor: STAT_COLORS[i].border,
            }}
          >
            <span
              className={styles.statValue}
              style={{ color: STAT_COLORS[i].color }}
            >
              {stat.value}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.sections}>
        {/* Quick Actions */}
        <section className={styles.section}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <Link href="/" className={styles.actionCard}>
              <span className={styles.actionIcon}>+</span>
              <div>
                <span className={styles.actionTitle}>Upload New CSV</span>
                <span className={styles.actionDesc}>
                  Import a new dataset for visualization
                </span>
              </div>
            </Link>
            <Link href="/workspace" className={styles.actionCard}>
              <span className={styles.actionIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M3 9h18" />
                </svg>
              </span>
              <div>
                <span className={styles.actionTitle}>Open Workspace</span>
                <span className={styles.actionDesc}>
                  Continue working on your charts
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Chart Breakdown */}
        {Object.keys(chartTypes).length > 0 && (
          <section className={styles.section}>
            <h2>Chart Breakdown</h2>
            <div className={styles.chartBreakdown}>
              {Object.entries(chartTypes)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count], i) => (
                  <div key={type} className={styles.breakdownItem}>
                    <span className={styles.breakdownType}>{type}</span>
                    <div className={styles.breakdownBar}>
                      <div
                        className={styles.breakdownFill}
                        style={{
                          width: `${(count / totalCharts) * 100}%`,
                          background: BAR_COLORS[i % BAR_COLORS.length],
                        }}
                      />
                    </div>
                    <span className={styles.breakdownCount}>{count}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Recent Datasets */}
        {recents.length > 0 && (
          <section className={styles.section}>
            <h2>Recent Datasets</h2>
            <div className={styles.recentsList}>
              {recents.map((dataset) => (
                <div key={dataset.id} className={styles.recentCard}>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentName}>
                      {dataset.fileName}
                    </span>
                    <span className={styles.recentMeta}>
                      {dataset.rowCount.toLocaleString()} rows &middot;{" "}
                      {dataset.columnCount} cols &middot;{" "}
                      {dataset.chartCount} chart
                      {dataset.chartCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className={styles.recentDate}>
                    {new Date(dataset.uploadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {recents.length === 0 && (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h2>No data yet</h2>
            <p>Upload your first CSV file to get started with visualizations.</p>
            <Link href="/" className={styles.ctaButton}>
              Get Started
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
