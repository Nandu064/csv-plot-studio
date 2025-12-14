"use client";

import { useState } from "react";
import { useFilterStore } from "@/lib/stores/filter-store";
import { confirmDanger, toastInfo } from "@/lib/ui/alerts";
import styles from "./FilterPanelDropdown.module.scss";

export function FilterPanel() {
  const filters = useFilterStore((state) => state.filters);
  const updateFilter = useFilterStore((state) => state.updateFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleClearAll = async () => {
    const confirmed = await confirmDanger(
      "Clear All Filters?",
      "This will reset all filters to their default values."
    );

    if (confirmed) {
      resetFilters();
      toastInfo("All filters cleared");
    }
  };

  const toggleDropdown = (column: string) => {
    setOpenDropdown(openDropdown === column ? null : column);
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Filters</h3>
        <button className={styles.clearButton} onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <div key={filter.column} className={styles.filterItem}>
            <button
              className={styles.filterButton}
              onClick={() => toggleDropdown(filter.column)}
            >
              {filter.column}
              <span className={styles.arrow}>
                {openDropdown === filter.column ? "▲" : "▼"}
              </span>
            </button>

            {openDropdown === filter.column && (
              <div className={styles.dropdown}>
                {filter.kind === "number" && (
                  <NumberFilterContent
                    filter={filter}
                    onUpdate={(updates) => updateFilter(filter.column, updates)}
                  />
                )}

                {filter.kind === "category" && (
                  <CategoryFilterContent
                    filter={filter}
                    onUpdate={(updates) => updateFilter(filter.column, updates)}
                  />
                )}

                {filter.kind === "boolean" && (
                  <BooleanFilterContent
                    filter={filter}
                    onUpdate={(updates) => updateFilter(filter.column, updates)}
                  />
                )}

                {filter.kind === "date" && (
                  <DateFilterContent
                    filter={filter}
                    onUpdate={(updates) => updateFilter(filter.column, updates)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NumberFilterContent({
  filter,
  onUpdate,
}: {
  filter: Extract<import("@/lib/types/filters").Filter, { kind: "number" }>;
  onUpdate: (updates: Partial<typeof filter>) => void;
}) {
  return (
    <div className={styles.numberFilter}>
      <label>
        Min:
        <input
          type="number"
          value={filter.valueMin}
          onChange={(e) => onUpdate({ valueMin: Number(e.target.value) })}
          min={filter.min}
          max={filter.max}
          step="any"
        />
      </label>
      <label>
        Max:
        <input
          type="number"
          value={filter.valueMax}
          onChange={(e) => onUpdate({ valueMax: Number(e.target.value) })}
          min={filter.min}
          max={filter.max}
          step="any"
        />
      </label>
      <div className={styles.range}>
        Range: {filter.min} to {filter.max}
      </div>
    </div>
  );
}

function CategoryFilterContent({
  filter,
  onUpdate,
}: {
  filter: Extract<import("@/lib/types/filters").Filter, { kind: "category" }>;
  onUpdate: (updates: Partial<typeof filter>) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredOptions = filter.options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newSelected = new Set(filter.selected);
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    onUpdate({ selected: newSelected });
  };

  const selectAll = () => {
    onUpdate({ selected: new Set(filter.options) });
  };

  const selectNone = () => {
    onUpdate({ selected: new Set() });
  };

  return (
    <div className={styles.categoryFilter}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.actions}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>

      <div className={styles.optionsList}>
        {filteredOptions.map((option) => (
          <label key={option} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filter.selected.has(option)}
              onChange={() => toggleOption(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className={styles.summary}>
        {filter.selected.size} of {filter.options.length} selected
      </div>
    </div>
  );
}

function BooleanFilterContent({
  filter,
  onUpdate,
}: {
  filter: Extract<import("@/lib/types/filters").Filter, { kind: "boolean" }>;
  onUpdate: (updates: Partial<typeof filter>) => void;
}) {
  const toggleValue = (value: "true" | "false") => {
    const newAllowed = new Set(filter.allowed);
    if (newAllowed.has(value)) {
      newAllowed.delete(value);
    } else {
      newAllowed.add(value);
    }
    onUpdate({ allowed: newAllowed });
  };

  return (
    <div className={styles.booleanFilter}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={filter.allowed.has("true")}
          onChange={() => toggleValue("true")}
        />
        <span>True</span>
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={filter.allowed.has("false")}
          onChange={() => toggleValue("false")}
        />
        <span>False</span>
      </label>
    </div>
  );
}

function DateFilterContent({
  filter,
  onUpdate,
}: {
  filter: Extract<import("@/lib/types/filters").Filter, { kind: "date" }>;
  onUpdate: (updates: Partial<typeof filter>) => void;
}) {
  return (
    <div className={styles.dateFilter}>
      <label>
        Start:
        <input
          type="date"
          value={filter.start || ""}
          onChange={(e) => onUpdate({ start: e.target.value || undefined })}
        />
      </label>
      <label>
        End:
        <input
          type="date"
          value={filter.end || ""}
          onChange={(e) => onUpdate({ end: e.target.value || undefined })}
        />
      </label>
    </div>
  );
}
