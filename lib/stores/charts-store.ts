import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ChartSpec, ChartConfig } from '../types';

interface ChartsStore {
  charts: Record<string, ChartSpec[]>; // Keyed by dataset signature
  addChart: (datasetSignature: string, config: ChartConfig) => void;
  updateChart: (datasetSignature: string, chartId: string, updates: Partial<ChartConfig>) => void;
  deleteChart: (datasetSignature: string, chartId: string) => void;
  getCharts: (datasetSignature: string) => ChartSpec[];
  clearCharts: (datasetSignature: string) => void;
}

export const useChartsStore = create<ChartsStore>()(
  persist(
    (set, get) => ({
      charts: {},
      addChart: (datasetSignature, config) => set((state) => {
        const existing = state.charts[datasetSignature] || [];
        const spec: ChartSpec = {
          ...config,
          id: config.id || nanoid(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return {
          charts: {
            ...state.charts,
            [datasetSignature]: [...existing, spec],
          },
        };
      }),
      updateChart: (datasetSignature, chartId, updates) => set((state) => {
        const existing = state.charts[datasetSignature] || [];
        return {
          charts: {
            ...state.charts,
            [datasetSignature]: existing.map(chart =>
              chart.id === chartId
                ? { ...chart, ...updates, updatedAt: Date.now() }
                : chart
            ),
          },
        };
      }),
      deleteChart: (datasetSignature, chartId) => set((state) => {
        const existing = state.charts[datasetSignature] || [];
        return {
          charts: {
            ...state.charts,
            [datasetSignature]: existing.filter(chart => chart.id !== chartId),
          },
        };
      }),
      getCharts: (datasetSignature) => {
        return get().charts[datasetSignature] || [];
      },
      clearCharts: (datasetSignature) => set((state) => {
        const newCharts = { ...state.charts };
        delete newCharts[datasetSignature];
        return { charts: newCharts };
      }),
    }),
    {
      name: 'csv-plot-studio-charts',
    }
  )
);
