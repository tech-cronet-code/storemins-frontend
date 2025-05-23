import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
}

const ROW_OPTIONS = [2, 5, 25, 50, 100];

const PaginationControls: React.FC<PaginationControlsProps> = ({
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
    <div className="w-full flex flex-wrap items-center justify-between gap-y-3 gap-x-6 px-4 sm:px-6 py-4 bg-white lg:mr-5">
      {/* Rows Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-1 text-sm text-blue-700 font-medium underline underline-offset-2"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {rowsPerPage} rows{" "}
          {dropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded shadow-md z-50 min-w-max text-sm">
            {ROW_OPTIONS.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onRowsPerPageChange(opt);
                  setDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  opt === rowsPerPage ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {opt} rows
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-500 whitespace-nowrap">
        {`${currentPage} of ${totalPages} Pages - ${totalItems} Items`}
      </div>

      {/* Pagination Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 text-sm flex items-center gap-1 border rounded-md transition font-medium ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-blue-700 border-blue-700 hover:bg-blue-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 text-sm flex items-center gap-1 border rounded-md transition font-medium ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-blue-700 border-blue-700 hover:bg-blue-50"
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
