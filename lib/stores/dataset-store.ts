import { create } from 'zustand';
import type { ParsedCSV } from '../types';

interface DatasetStore {
  dataset: ParsedCSV | null;
  setDataset: (dataset: ParsedCSV | null) => void;
  clearDataset: () => void;
}

export const useDatasetStore = create<DatasetStore>((set) => ({
  dataset: null,
  setDataset: (dataset) => set({ dataset }),
  clearDataset: () => set({ dataset: null }),
}));
