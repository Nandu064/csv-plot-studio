/**
 * Generate a stable hash from an array of strings (column headers)
 */
export function hashHeaders(headers: string[]): string {
  const str = headers.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Clean headers: auto-name empty headers, trim whitespace
 */
export function cleanHeaders(headers: string[]): { headers: string[]; modifications: string[] } {
  const modifications: string[] = [];
  const cleaned = headers.map((header, index) => {
    let cleaned = header.trim();
    if (!cleaned) {
      cleaned = `Column_${index + 1}`;
      modifications.push(`Empty header at position ${index + 1} renamed to "${cleaned}"`);
    }
    return cleaned;
  });
  return { headers: cleaned, modifications };
}

/**
 * Remove completely empty rows
 */
export function removeEmptyRows(rows: string[][]): { rows: string[][]; removedCount: number } {
  const filtered = rows.filter(row => {
    return row.some(cell => cell.trim() !== '');
  });
  return { rows: filtered, removedCount: rows.length - filtered.length };
}

/**
 * Trim whitespace in all string cells
 */
export function trimCells(rows: string[][]): string[][] {
  return rows.map(row => row.map(cell => cell.trim()));
}
