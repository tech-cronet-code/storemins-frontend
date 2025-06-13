import React, { useState, useEffect, useRef } from "react";

interface SubCategory {
  id: string;
  name: string;
  productCount: number;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
  image?: string;
  subcategories?: SubCategory[];
}

interface CategorySelectModalProps {
  open: boolean;
  categories: Category[];
  selectedCategoryIds: string[];
  onSelect: (selectedIds: string[]) => void;
  onAddNewCategory: () => void;
  onClose: () => void;
  loading: boolean; // ✅ ADD THIS
}

const CategorySelectModal: React.FC<CategorySelectModalProps> = ({
  open,
  categories,
  selectedCategoryIds,
  onSelect,
  onAddNewCategory,
  onClose,
  loading, // ✅ AND HERE
}) => {
  const [search, setSearch] = useState("");
  const [localSelected, setLocalSelected] =
    useState<string[]>(selectedCategoryIds);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ FIX: Sync selected categories when modal opens
  useEffect(() => {
    if (open) {
      setLocalSelected(selectedCategoryIds);
    }
  }, [open, selectedCategoryIds]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const toggleCategory = (categoryId: string) => {
    setLocalSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleExpand = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelect = () => {
    onSelect(localSelected);
    onClose();
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderCategory = (cat: Category) => (
    <div key={cat.id}>
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
          localSelected.includes(cat.id)
            ? "bg-blue-50 border border-blue-200"
            : "hover:bg-gray-50"
        }`}
        onClick={(e) => {
          const isArrowClick = (e.target as HTMLElement).closest(
            ".expand-arrow"
          );
          if (isArrowClick) return; // Prevent category select if arrow clicked
          toggleCategory(cat.id);
        }}
      >
        <div className="flex items-center space-x-4 flex-1">
          {cat.image && (
            <img
              src={cat.image}
              alt={cat.name}
              className="w-10 h-10 rounded-md object-cover border"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{cat.name}</span>
              {cat.subcategories && (
                <button
                  type="button"
                  className="expand-arrow text-gray-500 hover:text-gray-800 transform transition-transform"
                  onClick={(e) => {
                    e.stopPropagation(); // prevents bubbling
                    toggleExpand(cat.id, e);
                  }}
                >
                  <span className="inline-block">
                    {expandedCategories.includes(cat.id) ? (
                      <span className="rotate-90 inline-block">➤</span>
                    ) : (
                      <span className="inline-block">➤</span>
                    )}
                  </span>
                </button>
              )}
            </div>
            <div className="text-gray-400 text-xs">
              {cat.productCount} products
            </div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={localSelected.includes(cat.id)}
          readOnly
          className="w-4 h-4 text-blue-600 border-gray-300 rounded pointer-events-none"
        />
      </div>

      {/* Subcategories */}
      {expandedCategories.includes(cat.id) && cat.subcategories && (
        <div className="pl-12 mt-2 space-y-2">
          {cat.subcategories.map((sub) => (
            <div
              key={sub.id}
              className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                localSelected.includes(sub.id)
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => toggleCategory(sub.id)}
            >
              <div className="flex items-center space-x-4 flex-1">
                {sub.image && (
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-8 h-8 rounded-md object-cover border"
                  />
                )}
                <div>
                  <span className="font-medium text-gray-700">{sub.name}</span>
                  <div className="text-gray-400 text-xs">
                    {sub.productCount} products
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSelected.includes(sub.id)}
                readOnly
                className="w-4 h-4 text-blue-600 border-gray-300 rounded pointer-events-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen transition-opacity duration-300 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-bold mb-5 text-center text-gray-800">
          Select Categories
        </h2>

        {/* Search Box */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* Category List */}
        <div className="max-h-48 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {loading ? (
            <div className="text-center text-gray-400 text-sm">Loading...</div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => renderCategory(cat))
          ) : (
            <div className="text-center text-gray-400 text-sm">
              No categories found
            </div>
          )}
        </div>

        {/* Add New Category Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onAddNewCategory}
            className="w-full border border-orange-500 text-orange-500 font-semibold py-2 rounded-lg hover:bg-orange-50 transition text-sm"
          >
            + Add New Category or Subcategory
          </button>
        </div>

        {/* Select Button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleSelect}
            disabled={localSelected.length === 0}
            className={`px-8 py-2 rounded-lg text-white text-sm font-semibold transition ${
              localSelected.length
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectModal;
