import { describe, it, expect } from 'vitest';
import { cleanHeaders, removeEmptyRows, hashHeaders } from '@/lib/utils/csv-cleaning';
import { inferColumnTypes } from '@/lib/utils/type-inference';
import { buildParsedCSV } from '@/lib/utils/csv-builder';

describe('CSV Cleaning', () => {
  describe('cleanHeaders', () => {
    it('should trim whitespace from headers', () => {
      const result = cleanHeaders(['  name  ', '  age  ']);
      expect(result.headers).toEqual(['name', 'age']);
    });

    it('should auto-name empty headers', () => {
      const result = cleanHeaders(['name', '', 'age']);
      expect(result.headers).toEqual(['name', 'Column_2', 'age']);
      expect(result.modifications).toHaveLength(1);
    });

    it('should handle all empty headers', () => {
      const result = cleanHeaders(['', '', '']);
      expect(result.headers).toEqual(['Column_1', 'Column_2', 'Column_3']);
      expect(result.modifications).toHaveLength(3);
    });
  });

  describe('removeEmptyRows', () => {
    it('should remove completely empty rows', () => {
      const rows = [
        ['a', 'b'],
        ['', ''],
        ['c', 'd'],
        ['  ', '  '],
      ];
      const result = removeEmptyRows(rows);
      expect(result.rows).toHaveLength(2);
      expect(result.removedCount).toBe(2);
    });

    it('should keep rows with at least one non-empty cell', () => {
      const rows = [
        ['a', ''],
        ['', 'b'],
        ['', ''],
      ];
      const result = removeEmptyRows(rows);
      expect(result.rows).toHaveLength(2);
    });
  });

  describe('hashHeaders', () => {
    it('should generate consistent hash for same headers', () => {
      const hash1 = hashHeaders(['name', 'age', 'city']);
      const hash2 = hashHeaders(['name', 'age', 'city']);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hash for different headers', () => {
      const hash1 = hashHeaders(['name', 'age']);
      const hash2 = hashHeaders(['name', 'city']);
      expect(hash1).not.toBe(hash2);
    });

    it('should be order-sensitive', () => {
      const hash1 = hashHeaders(['name', 'age']);
      const hash2 = hashHeaders(['age', 'name']);
      expect(hash1).not.toBe(hash2);
    });
  });
});

describe('Type Inference', () => {
  describe('inferColumnTypes', () => {
    it('should detect numeric columns', () => {
      const rows = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ];
      const headers = ['col1', 'col2', 'col3'];
      const result = inferColumnTypes(rows, headers);
      
      expect(result[0].kind).toBe('number');
      expect(result[0].min).toBe(1);
      expect(result[0].max).toBe(7);
    });

    it('should detect date columns with ISO format', () => {
      const rows = [
        ['2024-01-01', 'data1'],
        ['2024-01-02', 'data2'],
        ['2024-01-03', 'data3'],
      ];
      const headers = ['date', 'value'];
      const result = inferColumnTypes(rows, headers);
      
      expect(result[0].kind).toBe('date');
      expect(result[0].dateFormat).toBe('ISO_8601');
    });

    it('should detect boolean columns', () => {
      const rows = [
        ['true', 'false'],
        ['yes', 'no'],
        ['1', '0'],
      ];
      const headers = ['bool1', 'bool2'];
      const result = inferColumnTypes(rows, headers);
      
      expect(result[0].kind).toBe('boolean');
      expect(result[1].kind).toBe('boolean');
    });

    it('should detect text columns', () => {
      const rows = [
        ['apple', 'banana'],
        ['cherry', 'date'],
        ['elderberry', 'fig'],
      ];
      const headers = ['fruit1', 'fruit2'];
      const result = inferColumnTypes(rows, headers);
      
      expect(result[0].kind).toBe('text');
      expect(result[1].kind).toBe('text');
    });

    it('should detect mixed columns', () => {
      const rows = [
        ['1', 'text'],
        ['2', 'more'],
        ['not a number', 'data'],
      ];
      const headers = ['mixed', 'text'];
      const result = inferColumnTypes(rows, headers);
      
      expect(result[0].kind).toBe('mixed');
    });
  });
});

describe('CSV Builder', () => {
  describe('buildParsedCSV', () => {
    it('should build complete ParsedCSV object', () => {
      const input = {
        fileName: 'test.csv',
        headers: ['name', 'age', 'city'],
        rows: [
          ['Alice', '30', 'NYC'],
          ['Bob', '25', 'LA'],
        ],
      };
      
      const result = buildParsedCSV(input);
      
      expect(result.fileName).toBe('test.csv');
      expect(result.headers).toEqual(['name', 'age', 'city']);
      expect(result.rowCount).toBe(2);
      expect(result.columnCount).toBe(3);
      expect(result.columns).toHaveLength(3);
      expect(result.signature).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should clean headers and track modifications', () => {
      const input = {
        fileName: 'test.csv',
        headers: ['  name  ', '', 'city'],
        rows: [['Alice', '30', 'NYC']],
      };
      
      const result = buildParsedCSV(input);
      
      expect(result.headers).toEqual(['name', 'Column_2', 'city']);
      expect(result.modifications.length).toBeGreaterThan(0);
    });

    it('should remove empty rows and track count', () => {
      const input = {
        fileName: 'test.csv',
        headers: ['name', 'age'],
        rows: [
          ['Alice', '30'],
          ['', ''],
          ['Bob', '25'],
        ],
      };
      
      const result = buildParsedCSV(input);
      
      expect(result.rowCount).toBe(2);
      expect(result.modifications.some(m => m.includes('empty row'))).toBe(true);
    });
  });
});
