import Papa from 'papaparse';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_ROWS = 1_000_000;
const MAX_COLUMNS = 100;

interface WorkerInput {
  file: File;
}

self.onmessage = async (e: MessageEvent<WorkerInput>) => {
  const { file } = e.data;

  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      self.postMessage({
        type: 'error',
        error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
      return;
    }

    self.postMessage({
      type: 'progress',
      progress: 0,
      message: 'Reading file...',
    });

    const text = await file.text();

    self.postMessage({
      type: 'progress',
      progress: 30,
      message: 'Parsing CSV...',
    });

    const parseResult = Papa.parse(text, {
      dynamicTyping: false, // Keep everything as strings
      skipEmptyLines: false, // We'll handle this ourselves
    });

    if (parseResult.errors.length > 0) {
      const criticalError = parseResult.errors.find(e => e.type === 'Quotes' || e.type === 'FieldMismatch');
      if (criticalError) {
        self.postMessage({
          type: 'error',
          error: `CSV parsing error: ${criticalError.message}`,
        });
        return;
      }
    }

    const allRows = parseResult.data as string[][];

    if (allRows.length === 0) {
      self.postMessage({
        type: 'error',
        error: 'CSV file is empty',
      });
      return;
    }

    self.postMessage({
      type: 'progress',
      progress: 60,
      message: 'Processing data...',
    });

    const headers = allRows[0];
    const dataRows = allRows.slice(1);

    // Validate limits
    if (headers.length > MAX_COLUMNS) {
      self.postMessage({
        type: 'error',
        error: `CSV has ${headers.length} columns, maximum is ${MAX_COLUMNS}`,
      });
      return;
    }

    if (dataRows.length > MAX_ROWS) {
      self.postMessage({
        type: 'error',
        error: `CSV has ${dataRows.length} rows, maximum is ${MAX_ROWS}`,
      });
      return;
    }

    self.postMessage({
      type: 'progress',
      progress: 90,
      message: 'Finalizing...',
    });

    // Return raw parsed data
    self.postMessage({
      type: 'success',
      data: {
        fileName: file.name,
        headers,
        rows: dataRows,
      },
    });

  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export {};
