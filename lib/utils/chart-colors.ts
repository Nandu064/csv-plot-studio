import type { ColumnMetadata } from '../types/csv';

export function isNumericColumn(col?: ColumnMetadata): boolean {
  return col?.kind === 'number';
}

export function getTopCategories(rows: string[][], columnIndex: number, limit = 12): string[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const value = row[columnIndex];
    if (value == null || value === '') continue;
    const str = String(value);
    counts.set(str, (counts.get(str) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}

// Vivid palette optimized for dark backgrounds
const CHART_COLORS = [
  '#818cf8', // indigo
  '#34d399', // emerald
  '#fbbf24', // amber
  '#f472b6', // pink
  '#a78bfa', // violet
  '#fb923c', // orange
  '#22d3ee', // cyan
  '#f87171', // red
  '#4ade80', // green
  '#60a5fa', // blue
  '#e879f9', // fuchsia
  '#facc15', // yellow
];

export function getChartColor(index: number, bright = false): string {
  const color = CHART_COLORS[index % CHART_COLORS.length];
  return bright ? color : color + 'cc';
}
