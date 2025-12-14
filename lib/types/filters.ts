export type Filter =
  | { kind: 'number'; column: string; min: number; max: number; valueMin: number; valueMax: number }
  | { kind: 'date'; column: string; start?: string; end?: string }
  | { kind: 'boolean'; column: string; allowed: Set<'true' | 'false'> }
  | { kind: 'category'; column: string; options: string[]; selected: Set<string> };

export interface FilterState {
  filters: Filter[];
  activeFilters: ActiveFilter[]; // For chip display
}

export interface ActiveFilter {
  column: string;
  label: string;
  kind: Filter['kind'];
}
