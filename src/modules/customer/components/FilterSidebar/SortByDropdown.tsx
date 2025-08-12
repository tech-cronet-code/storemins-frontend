import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sortOptions = [
  "Created (Newest date)",
  "Created (Oldest date)",
  "Updated (Newest date)",
  "Updated (Oldest date)",
  "Product name (A-Z)",
  "Product name (Z-A)",
  "Inventory (High to low)",
  "Inventory (Low to high)",
  "MRP (High to low)",
  "MRP (Low to high)",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SortByDropdown: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm text-gray-700 font-medium px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
      >
        ⬍ Sort by
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 bg-white shadow-lg border border-gray-200 rounded-md w-[260px] p-2">
          {sortOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded"
            >
              <input
                type="radio"
                name="sortOption"
                checked={value === option}
                onChange={() => {
                  onChange(option);
                  setOpen(false);
                }}
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortByDropdown;
