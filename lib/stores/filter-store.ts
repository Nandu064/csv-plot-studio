import { create } from 'zustand';
import type { Filter, ActiveFilter } from '../types/filters';

interface FilterStore {
  filters: Filter[];
  activeFilters: ActiveFilter[];
  setFilters: (filters: Filter[]) => void;
  updateFilter: (column: string, updates: Partial<Filter>) => void;
  removeFilter: (column: string) => void;
  resetFilters: () => void;
  computeActiveFilters: () => void;
}

// Helper function to compute active filters
function computeActiveFiltersFromState(filters: Filter[]): ActiveFilter[] {
  const active: ActiveFilter[] = [];
  
  for (const filter of filters) {
    if (filter.kind === 'number') {
      if (filter.valueMin !== filter.min || filter.valueMax !== filter.max) {
        active.push({
          column: filter.column,
          label: `${filter.column}: ${filter.valueMin}–${filter.valueMax}`,
          kind: 'number',
        });
      }
    }
    
    if (filter.kind === 'category') {
      if (filter.selected.size !== filter.options.length) {
        const selectedArray = Array.from(filter.selected);
        const label = selectedArray.length <= 3
          ? `${filter.column}: ${selectedArray.join(', ')}`
          : `${filter.column}: ${selectedArray.length} selected`;
        active.push({
          column: filter.column,
          label,
          kind: 'category',
        });
      }
    }
    
    if (filter.kind === 'boolean') {
      if (filter.allowed.size !== 2) {
        const allowed = Array.from(filter.allowed).join(', ');
        active.push({
          column: filter.column,
          label: `${filter.column}: ${allowed}`,
          kind: 'boolean',
        });
      }
    }
    
    if (filter.kind === 'date') {
      if (filter.start || filter.end) {
        const parts: string[] = [];
        if (filter.start) parts.push(`from ${filter.start}`);
        if (filter.end) parts.push(`to ${filter.end}`);
        active.push({
          column: filter.column,
          label: `${filter.column}: ${parts.join(' ')}`,
          kind: 'date',
        });
      }
    }
  }
  
  return active;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: [],
  activeFilters: [],
  
  setFilters: (filters) => set({ 
    filters,
    activeFilters: computeActiveFiltersFromState(filters),
  }),
  
  updateFilter: (column, updates) => set((state) => {
    const newFilters = state.filters.map((f) =>
      f.column === column ? { ...f, ...updates } as Filter : f
    );
    return {
      filters: newFilters,
      activeFilters: computeActiveFiltersFromState(newFilters),
    };
  }),
  
  removeFilter: (column) => set((state) => {
    const filter = state.filters.find(f => f.column === column);
    if (!filter) return state;
    
    let newFilters = state.filters;
    
    // Reset to default values instead of removing
    if (filter.kind === 'number') {
      newFilters = state.filters.map(f =>
        f.column === column && f.kind === 'number'
          ? { ...f, valueMin: f.min, valueMax: f.max }
          : f
      );
    } else if (filter.kind === 'category') {
      newFilters = state.filters.map(f =>
        f.column === column && f.kind === 'category'
          ? { ...f, selected: new Set(f.options) }
          : f
      );
    } else if (filter.kind === 'boolean') {
      newFilters = state.filters.map(f =>
        f.column === column && f.kind === 'boolean'
          ? { ...f, allowed: new Set(['true', 'false'] as const) }
          : f
      );
    } else if (filter.kind === 'date') {
      newFilters = state.filters.map(f =>
        f.column === column && f.kind === 'date'
          ? { ...f, start: undefined, end: undefined }
          : f
      );
    }
    
    return {
      filters: newFilters,
      activeFilters: computeActiveFiltersFromState(newFilters),
    };
  }),
  
  resetFilters: () => set((state) => {
    const newFilters = state.filters.map(f => {
      if (f.kind === 'number') {
        return { ...f, valueMin: f.min, valueMax: f.max };
      }
      if (f.kind === 'category') {
        return { ...f, selected: new Set(f.options) };
      }
      if (f.kind === 'boolean') {
        return { ...f, allowed: new Set(['true', 'false'] as const) };
      }
      if (f.kind === 'date') {
        return { ...f, start: undefined, end: undefined };
      }
      return f;
    });
    
    return {
      filters: newFilters,
      activeFilters: computeActiveFiltersFromState(newFilters),
    };
  }),
  
  computeActiveFilters: () => set((state) => ({
    activeFilters: computeActiveFiltersFromState(state.filters),
  })),
}));
