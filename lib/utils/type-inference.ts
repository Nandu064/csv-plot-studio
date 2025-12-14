import type { ColumnKind, ColumnMetadata, DateFormat } from '../types';
import { SAMPLE_SIZE_FOR_TYPE_INFERENCE } from '../constants/limits';

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
const US_SLASH_DATE_REGEX = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

function isISODate(value: string): boolean {
  return ISO_8601_REGEX.test(value);
}

function isUSSlashDate(value: string): boolean {
  return US_SLASH_DATE_REGEX.test(value);
}

function isDate(value: string): { isDate: boolean; format?: DateFormat } {
  if (isISODate(value)) {
    return { isDate: true, format: 'ISO_8601' };
  }
  if (isUSSlashDate(value)) {
    return { isDate: true, format: 'US_SLASH_DATE' };
  }
  return { isDate: false };
}

function isNumeric(value: string): boolean {
  if (value === '' || value === null) return false;
  return !isNaN(Number(value)) && isFinite(Number(value));
}

function isBoolean(value: string): boolean {
  const lower = value.toLowerCase();
  return lower === 'true' || lower === 'false' || lower === 'yes' || lower === 'no' || lower === '1' || lower === '0';
}

/**
 * Infer column types based on sample rows
 */
export function inferColumnTypes(rows: string[][], headers: string[]): ColumnMetadata[] {
  const sampleSize = Math.min(rows.length, SAMPLE_SIZE_FOR_TYPE_INFERENCE);
  const sampleRows = rows.slice(0, sampleSize);

  return headers.map((name, colIndex) => {
    const values = sampleRows.map(row => row[colIndex] || '').filter(v => v.trim() !== '');
    
    if (values.length === 0) {
      return { name, kind: 'text' as ColumnKind };
    }

    let numericCount = 0;
    let dateCount = 0;
    let booleanCount = 0;
    let dateFormat: DateFormat | undefined;
    const numericValues: number[] = [];

    for (const value of values) {
      if (isNumeric(value)) {
        numericCount++;
        numericValues.push(Number(value));
      }
      const dateCheck = isDate(value);
      if (dateCheck.isDate) {
        dateCount++;
        if (!dateFormat) dateFormat = dateCheck.format;
      }
      if (isBoolean(value)) {
        booleanCount++;
      }
    }

    const total = values.length;
    const numericRatio = numericCount / total;
    const dateRatio = dateCount / total;
    const booleanRatio = booleanCount / total;

    const metadata: ColumnMetadata = { name, kind: 'text' };

    // Determine kind based on ratios
    if (numericRatio > 0.8) {
      metadata.kind = 'number';
      if (numericValues.length > 0) {
        metadata.min = Math.min(...numericValues);
        metadata.max = Math.max(...numericValues);
        metadata.nanCount = values.length - numericValues.length;
      }
    } else if (dateRatio > 0.8) {
      metadata.kind = 'date';
      metadata.dateFormat = dateFormat;
    } else if (booleanRatio > 0.8) {
      metadata.kind = 'boolean';
    } else if (numericRatio > 0.2 || dateRatio > 0.2 || booleanRatio > 0.2) {
      metadata.kind = 'mixed';
    }

    // Calculate unique count
    metadata.uniqueCount = new Set(values).size;

    return metadata;
  });
}
