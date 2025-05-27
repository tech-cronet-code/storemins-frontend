import { useState } from "react";
import FilterDropdown from "../products/FilterDropdown";
import SortByDropdown from "./SortByDropdown";

const CategoryFilterBar = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("Created (Newest date)");
  const [typeFilter, setTypeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [hasProducts, setHasProducts] = useState("");

  const resetCategoryFilters = () => {
    setStatusFilter("");
    setSortBy("Created (Newest date)");
    setTypeFilter("");
    setLevelFilter("");
    setVisibilityFilter("");
    setHasProducts("");
  };

  return (
    <div className="w-full bg-white rounded-md border border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
        {/* Status */}
        <div className="min-w-[120px] w-full sm:w-auto">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={["Active", "Hidden"]}
            onChange={setStatusFilter}
          />
        </div>

        {/* Type */}
        <div className="min-w-[130px] w-full sm:w-auto">
          <FilterDropdown
            label="Type"
            value={typeFilter}
            options={["Product", "Service", "Digital"]}
            onChange={setTypeFilter}
          />
        </div>

        {/* Level */}
        <div className="min-w-[120px] w-full sm:w-auto">
          <FilterDropdown
            label="Level"
            value={levelFilter}
            options={["Parent", "Subcategory"]}
            onChange={setLevelFilter}
          />
        </div>

        {/* Visibility */}
        <div className="min-w-[130px] w-full sm:w-auto">
          <FilterDropdown
            label="Visibility"
            value={visibilityFilter}
            options={["Public", "Private"]}
            onChange={setVisibilityFilter}
          />
        </div>

        {/* Has Products */}
        <div className="min-w-[140px] w-full sm:w-auto">
          <FilterDropdown
            label="Has Products"
            value={hasProducts}
            options={["Yes", "No"]}
            onChange={setHasProducts}
          />
        </div>

        {/* Sort By */}
        <div className="min-w-[80px] w-full sm:w-auto">
          <SortByDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Clear All */}
        <div className="w-full sm:w-auto">
          <button
            onClick={resetCategoryFilters}
            className="text-sm font-medium text-blue-600 hover:underline whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterBar;
