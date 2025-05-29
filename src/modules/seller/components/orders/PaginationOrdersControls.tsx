import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
}

const ROW_OPTIONS = [2, 10, 25, 50, 100];

const PaginationOrdersControls: React.FC<Props> = ({
  currentPage,
  totalPages,
  totalItems,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-y-3 gap-x-6 px-4 sm:px-6 py-5 bg-white rounded-md">
      {/* Rows Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-1 text-sm text-blue-700 font-semibold hover:underline"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {rowsPerPage} rows{" "}
          {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {dropdownOpen && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[999] min-w-max text-sm">
            {ROW_OPTIONS.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onRowsPerPageChange(opt);
                  setDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer transition-all duration-150 hover:bg-blue-50 ${
                  opt === rowsPerPage
                    ? "bg-blue-100 font-bold text-blue-700"
                    : ""
                }`}
              >
                {opt} rows
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-600 font-medium">
        Page <span className="text-blue-700 font-semibold">{currentPage}</span>{" "}
        of {totalPages} — <span className="font-semibold">{totalItems}</span>{" "}
        items
      </div>

      {/* Pagination Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm flex items-center gap-1 rounded-md transition font-medium shadow-sm border ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
              : "text-white bg-blue-600 border-blue-600 hover:bg-blue-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm flex items-center gap-1 rounded-md transition font-medium shadow-sm border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
              : "text-white bg-blue-600 border-blue-600 hover:bg-blue-700"
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationOrdersControls;
