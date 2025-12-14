import type { ParsedCSV } from '../types/csv';
import type { Filter } from '../types/filters';
import { getTopCategories } from '../utils/chart-colors';

export function buildInitialFilters(dataset: ParsedCSV): Filter[] {
  const filters: Filter[] = [];
  
  for (let i = 0; i < dataset.headers.length; i++) {
    const header = dataset.headers[i];
    const colMeta = dataset.columns[i];
    
    if (colMeta.kind === 'number' && colMeta.min != null && colMeta.max != null) {
      filters.push({
        kind: 'number',
        column: header,
        min: colMeta.min,
        max: colMeta.max,
        valueMin: colMeta.min,
        valueMax: colMeta.max,
      });
      continue;
    }
    
    if (colMeta.kind === 'boolean') {
      filters.push({
        kind: 'boolean',
        column: header,
        allowed: new Set(['true', 'false']),
      });
      continue;
    }
    
    if (colMeta.kind === 'date') {
      filters.push({
        kind: 'date',
        column: header,
      });
      continue;
    }
    
    // For text/mixed: only create filter if we have reasonable distinct values
    if (colMeta.uniqueCount && colMeta.uniqueCount >= 2 && colMeta.uniqueCount <= 100) {
      const options = getTopCategories(dataset.rows, i, 20);
      if (options.length >= 2) {
        filters.push({
          kind: 'category',
          column: header,
          options,
          selected: new Set(options),
        });
      }
    }
  }
  
  return filters;
}

export function applyFilters(rows: string[][], headers: string[], filters: Filter[]): string[][] {
  if (filters.length === 0) return rows;
  
  return rows.filter((row) => {
    for (const filter of filters) {
      const colIndex = headers.indexOf(filter.column);
      if (colIndex === -1) continue;
      
      const value = row[colIndex];
      
      if (filter.kind === 'number') {
        const num = Number(value);
        if (Number.isNaN(num)) return false;
        if (num < filter.valueMin || num > filter.valueMax) return false;
      }
      
      if (filter.kind === 'boolean') {
        const str = String(value).toLowerCase();
        const normalized = (str === 'true' || str === 'yes' || str === '1') ? 'true'
          : (str === 'false' || str === 'no' || str === '0') ? 'false'
          : null;
        if (!normalized) return false;
        if (!filter.allowed.has(normalized)) return false;
      }
      
      if (filter.kind === 'category') {
        if (value == null) return false;
        if (!filter.selected.has(String(value))) return false;
      }
      
      if (filter.kind === 'date') {
        if (value == null || value === '') return false;
        const str = String(value);
        if (filter.start && str < filter.start) return false;
        if (filter.end && str > filter.end) return false;
      }
    }
    return true;
  });
}
