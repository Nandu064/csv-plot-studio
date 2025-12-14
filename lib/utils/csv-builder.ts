import { nanoid } from 'nanoid';
import type { ParsedCSV } from '../types';
import { cleanHeaders, removeEmptyRows, trimCells } from './csv-cleaning';
import { hashHeaders } from './csv-cleaning';
import { inferColumnTypes } from './type-inference';

export interface BuildParsedCSVInput {
  fileName: string;
  headers: string[];
  rows: string[][];
}

/**
 * Build a complete ParsedCSV object with cleaning, type inference, and metadata
 */
export function buildParsedCSV(input: BuildParsedCSVInput): ParsedCSV {
  const modifications: string[] = [];

  // Clean headers
  const { headers: cleanedHeaders, modifications: headerMods } = cleanHeaders(input.headers);
  modifications.push(...headerMods);

  // Remove empty rows
  const { rows: nonEmptyRows, removedCount } = removeEmptyRows(input.rows);
  if (removedCount > 0) {
    modifications.push(`Removed ${removedCount} empty row(s)`);
  }

  // Trim cells
  const trimmedRows = trimCells(nonEmptyRows);

  // Infer column types
  const columns = inferColumnTypes(trimmedRows, cleanedHeaders);

  // Generate signature
  const signature = hashHeaders(cleanedHeaders);

  return {
    id: nanoid(),
    fileName: input.fileName,
    headers: cleanedHeaders,
    rows: trimmedRows,
    rowCount: trimmedRows.length,
    columnCount: cleanedHeaders.length,
    columns,
    signature,
    uploadedAt: Date.now(),
    modifications,
  };
}
