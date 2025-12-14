import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DatasetMetadata } from '../types';

interface RecentsStore {
  recents: DatasetMetadata[];
  addRecent: (metadata: DatasetMetadata) => void;
  updateRecentChartCount: (signature: string, chartCount: number) => void;
  clearRecents: () => void;
}

export const useRecentsStore = create<RecentsStore>()(
  persist(
    (set) => ({
      recents: [],
      addRecent: (metadata) => set((state) => {
        // Remove if already exists
        const filtered = state.recents.filter(r => r.signature !== metadata.signature);
        // Add to front, keep last 10
        return { recents: [metadata, ...filtered].slice(0, 10) };
      }),
      updateRecentChartCount: (signature, chartCount) => set((state) => ({
        recents: state.recents.map(r => 
          r.signature === signature ? { ...r, chartCount } : r
        ),
      })),
      clearRecents: () => set({ recents: [] }),
    }),
    {
      name: 'csv-plot-studio-recents',
    }
  )
);
