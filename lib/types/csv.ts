export type ColumnKind = 'number' | 'date' | 'text' | 'boolean' | 'mixed';

export type DateFormat = 'ISO_8601' | 'US_SLASH_DATE' | 'UNKNOWN';

export interface ColumnMetadata {
  name: string;
  kind: ColumnKind;
  uniqueCount?: number;
  min?: number;
  max?: number;
  nanCount?: number;
  dateFormat?: DateFormat;
}

export interface ParsedCSV {
  id: string;
  fileName: string;
  headers: string[];
  rows: string[][];
  rowCount: number;
  columnCount: number;
  columns: ColumnMetadata[];
  signature: string; // Hash of headers for matching charts
  uploadedAt: number;
  modifications: string[];
}

export interface DatasetMetadata {
  id: string;
  fileName: string;
  signature: string;
  rowCount: number;
  columnCount: number;
  uploadedAt: number;
  chartCount: number;
}

export interface ParseProgress {
  type: 'progress';
  progress: number;
  message: string;
}

export interface ParseSuccess {
  type: 'success';
  data: ParsedCSV;
}

export interface ParseError {
  type: 'error';
  error: string;
}

export type ParseResult = ParseProgress | ParseSuccess | ParseError;
