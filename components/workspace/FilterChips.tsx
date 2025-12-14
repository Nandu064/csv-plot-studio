"use client";

import { useFilterStore } from "@/lib/stores/filter-store";
import { confirmDanger } from "@/lib/ui/alerts";
import styles from "./FilterChips.module.scss";

/**
 * FilterChips - Displays active filters as closable chips
 * Shows which filters are currently applied with ability to remove individual filters
 */
export function FilterChips() {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const removeFilter = useFilterStore((state) => state.removeFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const handleRemoveFilter = (column: string) => {
    removeFilter(column);
  };

  const handleClearAll = async () => {
    const confirmed = await confirmDanger(
      "Clear All Filters?",
      "This will reset all filters to their default values."
    );

    if (confirmed) {
      resetFilters();
    }
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.label}>Active Filters:</div>
      <div className={styles.chips}>
        {activeFilters.map((filter) => (
          <button
            key={filter.column}
            className={styles.chip}
            onClick={() => handleRemoveFilter(filter.column)}
            aria-label={`Remove filter: ${filter.label}`}
            title="Click to remove this filter"
          >
            <span className={styles.chipLabel}>{filter.label}</span>
            <span className={styles.chipClose} aria-hidden="true">
              ×
            </span>
          </button>
        ))}
        {activeFilters.length > 1 && (
          <button
            className={styles.clearAll}
            onClick={handleClearAll}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
