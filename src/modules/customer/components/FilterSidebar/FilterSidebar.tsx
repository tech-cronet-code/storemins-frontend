import React, { useState } from "react";
import CheckboxFilter, { CheckboxOption } from "./CheckboxFilter";
import PriceRange from "./PriceRange";

interface FilterSidebarProps {
  price: { min: number; max: number };
  onPriceApply: (min: number, max: number) => void;
  onClearPrice: () => void;

  sizes: CheckboxOption[];
  onToggleSize: (size: string) => void;
  onClearSizes: () => void;

  colors: CheckboxOption[];
  onToggleColor: (color: string) => void;
  onClearColors: () => void;

  onClearAll: () => void;
}

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}> = ({ title, children, onClear }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-gray-700">{title}</h4>
      {onClear && (
        <button
          onClick={onClear}
          className="text-sm text-blue-500 hover:underline focus:outline-none"
        >
          Clear
        </button>
      )}
    </div>
    {children}
  </div>
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  price,
  onPriceApply,
  onClearPrice,
  sizes,
  onToggleSize,
  onClearSizes,
  colors,
  onToggleColor,
  onClearColors,
  onClearAll,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile: toggle + reset */}
      <div className="md:hidden mb-4 flex justify-between items-center">
        <button
          className="flex-1 flex justify-between items-center bg-white p-3 rounded-lg shadow"
          onClick={() => setIsMobileOpen((o) => !o)}
        >
          <span className="font-medium">Filters</span>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              isMobileOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          onClick={onClearAll}
          className="ml-2 text-sm text-red-500 hover:underline focus:outline-none"
        >
          Reset All
        </button>
      </div>

      <aside
        className={`
          bg-white rounded-lg shadow-md p-4
          md:block
          ${isMobileOpen ? "block" : "hidden"}
        `}
      >
        {/* Desktop: reset */}
        <div className="hidden md:flex justify-end mb-4">
          <button
            onClick={onClearAll}
            className="text-sm text-red-500 hover:underline focus:outline-none"
          >
            Reset All
          </button>
        </div>

        <FilterSection title="Price Range" onClear={onClearPrice}>
          <PriceRange min={price.min} max={price.max} onApply={onPriceApply} />
        </FilterSection>

        <FilterSection title="Size" onClear={onClearSizes}>
          <CheckboxFilter title="" options={sizes} onToggle={onToggleSize} />
        </FilterSection>

        <FilterSection title="Color" onClear={onClearColors}>
          <CheckboxFilter title="" options={colors} onToggle={onToggleColor} />
        </FilterSection>
      </aside>
    </>
  );
};

export default FilterSidebar;
