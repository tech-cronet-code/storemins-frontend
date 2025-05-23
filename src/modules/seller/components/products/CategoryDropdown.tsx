import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CategoryOption {
  name: string;
  subcategories?: string[];
}

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => void;
}

const categories: CategoryOption[] = [
  {
    name: "Home Essentials",
    subcategories: ["All Products", "Sub Category Test", "Third Test"],
  },
  { name: "test name" },
  { name: "Jewelleries" },
  { name: "Women's Wear" },
  { name: "Kid's Wear" },
  { name: "Men's Wear" },
  { name: "Keyboard" },
  { name: "Mouse" },
  { name: "Laptop" },
];

const CategoryDropdown: React.FC<Props> = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSelect = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const clearAll = () => setSelected([]);
  const apply = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-[150px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 flex items-center justify-between"
      >
        {selected.length > 0
          ? `${selected[0]}${
              selected.length > 1 ? ` +${selected.length - 1}` : ""
            }`
          : "Category"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-[250px] bg-white border border-gray-200 rounded-md shadow-md">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative group hover:bg-gray-100"
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <label className="flex items-center px-4 py-2 text-sm gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(cat.name)}
                  onChange={() => toggleSelect(cat.name)}
                />
                <span className="flex-1 font-normal">{cat.name}</span>
                {cat.subcategories && (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </label>

              {hoveredCategory === cat.name && cat.subcategories && (
                <div className="absolute left-full top-0 ml-1 w-[200px] bg-white border border-gray-200 rounded-md shadow-md z-30">
                  {cat.subcategories.map((sub) => (
                    <label
                      key={sub}
                      className="flex items-center px-4 py-2 text-sm gap-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(sub)}
                        onChange={() => toggleSelect(sub)}
                      />
                      {sub}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center border-t border-gray-200 px-4 py-2">
            <button
              onClick={apply}
              className="text-white bg-blue-600 hover:bg-blue-700 text-sm px-4 py-1 rounded"
            >
              Apply
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
