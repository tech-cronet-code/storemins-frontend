import React, { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategorySelectDropdownProps {
  open: boolean;
  categories: Category[];
  selectedCategoryIds: string[];
  onSelect: (selectedIds: string[]) => void;
  onClose: () => void;
}

const CategorySelectDropdown: React.FC<CategorySelectDropdownProps> = ({
  open,
  categories,
  selectedCategoryIds,
  onSelect,
  onClose,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setLocalSelected(selectedCategoryIds);
    }
  }, [open, selectedCategoryIds]);

  const handleClick = (id: string) => {
    setLocalSelected([id]);
    onSelect([id]);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 relative">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Select Category
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-5 max-h-[360px] overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition hover:shadow-md ${
                localSelected.includes(cat.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-14 h-14 mb-2 object-contain"
              />
              <span className="text-sm font-medium text-gray-800 text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelectDropdown;