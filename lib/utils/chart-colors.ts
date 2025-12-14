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

// Color palette for categories
const CHART_COLORS = [
  '#00ff41', // neon green (primary)
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#ffff00', // yellow
  '#ff6600', // orange
  '#6600ff', // purple
  '#ff0066', // pink
  '#00ff99', // mint
  '#ff9900', // amber
  '#0099ff', // sky blue
  '#99ff00', // lime
  '#ff0099', // hot pink
];

export function getChartColor(index: number, bright = false): string {
  const color = CHART_COLORS[index % CHART_COLORS.length];
  return bright ? color : color + 'cc'; // Add opacity for non-bright
}
