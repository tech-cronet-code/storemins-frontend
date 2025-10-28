import React from "react";

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest First", value: "newest" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Alphabetically (A → Z)", value: "alpha_asc" },
  { label: "Alphabetically (Z → A)", value: "alpha_desc" },
];

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => (
  <div className="mb-4 self-end">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 text-sm"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortSelect;
