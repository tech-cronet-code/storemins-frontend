import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
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
const MAX_PAGE_BUTTONS = 10;

const PaginationControls: React.FC<Props> = ({
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

  const renderPageButtons = () => {
    const buttons = [];
    const startPage = Math.max(
      1,
      Math.min(currentPage - 4, totalPages - MAX_PAGE_BUTTONS + 1)
    );
    const endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);

    for (let i = startPage; i <= endPage; i++) {
      const isCurrent = i === currentPage;
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1.5 text-sm rounded-md font-medium border shadow-sm transition ${
            isCurrent
              ? "text-white bg-blue-600 border-blue-600 hover:bg-blue-700"
              : "text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

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
        Page{" "}
        <span className="text-blue-700 font-semibold">
          {totalPages === 0 ? 0 : currentPage}
        </span>{" "}
        of {totalPages} — <span className="font-semibold">{totalItems}</span>{" "}
        items
      </div>

      {/* Pagination Buttons */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-2 rounded border text-sm disabled:opacity-50"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-2 rounded border text-sm disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {renderPageButtons()}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2 py-2 rounded border text-sm disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="px-2 py-2 rounded border text-sm disabled:opacity-50"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
