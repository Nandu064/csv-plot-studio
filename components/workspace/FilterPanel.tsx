"use client";

import { useFilterStore } from "@/lib/stores/filter-store";
import styles from "./FilterPanel.module.scss";

interface FilterPanelProps {
  onFiltersChange?: () => void;
}

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const filters = useFilterStore((state) => state.filters);
  const updateFilter = useFilterStore((state) => state.updateFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const hasActiveFilters = filters.some((f) => {
    if (f.kind === "number")
      return f.valueMin !== f.min || f.valueMax !== f.max;
    if (f.kind === "boolean") return f.allowed.size !== 2;
    if (f.kind === "category") return f.selected.size !== f.options.length;
    if (f.kind === "date") return f.start != null || f.end != null;
    return false;
  });

  const handleNumberChange = (
    column: string,
    field: "valueMin" | "valueMax",
    value: number
  ) => {
    updateFilter(column, { [field]: value });
    onFiltersChange?.();
  };

  const handleBooleanToggle = (column: string, value: "true" | "false") => {
    const filter = filters.find((f) => f.column === column);
    if (filter?.kind === "boolean") {
      const newAllowed = new Set(filter.allowed);
      if (newAllowed.has(value)) {
        newAllowed.delete(value);
      } else {
        newAllowed.add(value);
      }
      updateFilter(column, { allowed: newAllowed });
      onFiltersChange?.();
    }
  };

  const handleCategoryToggle = (column: string, value: string) => {
    const filter = filters.find((f) => f.column === column);
    if (filter?.kind === "category") {
      const newSelected = new Set(filter.selected);
      if (newSelected.has(value)) {
        newSelected.delete(value);
      } else {
        newSelected.add(value);
      }
      updateFilter(column, { selected: newSelected });
      onFiltersChange?.();
    }
  };

  const handleDateChange = (
    column: string,
    field: "start" | "end",
    value: string
  ) => {
    updateFilter(column, { [field]: value || undefined });
    onFiltersChange?.();
  };

  const handleClearAll = () => {
    resetFilters();
    onFiltersChange?.();
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className={styles.clearButton} onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <div key={filter.column} className={styles.filterItem}>
            <label className={styles.filterLabel}>{filter.column}</label>

            {filter.kind === "number" && (
              <div className={styles.numberFilter}>
                <input
                  type="number"
                  value={filter.valueMin}
                  onChange={(e) =>
                    handleNumberChange(
                      filter.column,
                      "valueMin",
                      parseFloat(e.target.value)
                    )
                  }
                  min={filter.min}
                  max={filter.max}
                  step="any"
                  className={styles.numberInput}
                />
                <span className={styles.separator}>to</span>
                <input
                  type="number"
                  value={filter.valueMax}
                  onChange={(e) =>
                    handleNumberChange(
                      filter.column,
                      "valueMax",
                      parseFloat(e.target.value)
                    )
                  }
                  min={filter.min}
                  max={filter.max}
                  step="any"
                  className={styles.numberInput}
                />
              </div>
            )}

            {filter.kind === "boolean" && (
              <div className={styles.booleanFilter}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filter.allowed.has("true")}
                    onChange={() => handleBooleanToggle(filter.column, "true")}
                  />
                  <span>True</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filter.allowed.has("false")}
                    onChange={() => handleBooleanToggle(filter.column, "false")}
                  />
                  <span>False</span>
                </label>
              </div>
            )}

            {filter.kind === "category" && (
              <div className={styles.categoryFilter}>
                <div className={styles.categoryButtons}>
                  {filter.options.slice(0, 10).map((option) => (
                    <label key={option} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filter.selected.has(option)}
                        onChange={() =>
                          handleCategoryToggle(filter.column, option)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {filter.options.length > 10 && (
                  <div className={styles.categoryNote}>
                    Showing 10 of {filter.options.length} options
                  </div>
                )}
              </div>
            )}

            {filter.kind === "date" && (
              <div className={styles.dateFilter}>
                <input
                  type="date"
                  value={filter.start || ""}
                  onChange={(e) =>
                    handleDateChange(filter.column, "start", e.target.value)
                  }
                  className={styles.dateInput}
                  placeholder="Start date"
                />
                <span className={styles.separator}>to</span>
                <input
                  type="date"
                  value={filter.end || ""}
                  onChange={(e) =>
                    handleDateChange(filter.column, "end", e.target.value)
                  }
                  className={styles.dateInput}
                  placeholder="End date"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
