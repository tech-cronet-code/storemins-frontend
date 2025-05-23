import React, { useEffect, useRef, useState } from "react";

interface AddFieldFormProps {
  onSave: () => void;
  onCancel: () => void;
  onCheckoutFieldSelect: () => void; // 💎
}

const AddFieldForm: React.FC<AddFieldFormProps> = ({
  onSave,
  onCancel,
  onCheckoutFieldSelect,
}) => {
  const [showInCategory, setShowInCategory] = useState(false);
  const [hideInFilterMenu, setHideInFilterMenu] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState("");
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const fieldDropdownRef = useRef<HTMLDivElement>(null);

  const allCategories = [
    "Home Essentials → Sub Category Test",
    "test name",
    "Third Test",
    "Jewelleries",
    "Women's Wear",
    "Kitchen Items",
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        fieldDropdownRef.current &&
        !fieldDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFieldDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldTypeSelect = (option: string) => {
    if (option === "Checkout Field 💎✨") {
      onCheckoutFieldSelect(); // triggers modal
      // Reset after short delay to wait for modal to open
      setTimeout(() => {
        setSelectedFieldType("");
      }, 100); // prevents visual glitch
    } else {
      setSelectedFieldType(option);
    }
    setShowFieldDropdown(false);
  };

  return (
    <>
      {/* Main Form */}
      <div className="w-full max-w-full">
        <div className="pt-1 space-y-6">
          {/* Product Field Type Dropdown */}
          <div className="relative" ref={fieldDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Field Type
            </label>
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
              onClick={() => setShowFieldDropdown((prev) => !prev)}
            >
              {selectedFieldType || (
                <span className="text-gray-400">Select Field Type</span>
              )}
            </div>
            {showFieldDropdown && (
              <ul className="absolute top-full mt-1 w-full z-30 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
                {[
                  "Variant Field",
                  "Attribute Field",
                  "Checkout Field 💎✨",
                ].map((option, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleFieldTypeSelect(option)}
                    className={`px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 ${
                      selectedFieldType === option ? "bg-gray-50" : ""
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Allows additional information to be included on the product
              description page.
            </p>
          </div>

          {/* Field Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Input the field name that helps identify its purpose or content."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Input the description"
            />
          </div>

          <hr className="border-t border-gray-200" />

          {/* Show Field in Category Toggle */}
          <div className="flex items-start justify-between pt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Show Field in Category
              </label>
              <p className="text-xs text-gray-500">
                Enabling this option will cause fields to appear only on
                selected categories.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showInCategory}
                onChange={() => {
                  setShowInCategory((prev) => !prev);
                  setShowCategoryDropdown(false);
                }}
              />
              <div className="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300" />
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-all duration-300" />
            </label>
          </div>

          {/* Category Selection */}
          {showInCategory && (
            <div className="relative" ref={categoryDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <div
                className="w-full border border-gray-300 rounded-md bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
                onClick={() => setShowCategoryDropdown((prev) => !prev)}
              >
                {selectedCategories.length === 0 ? (
                  <span className="text-gray-400">Select categories...</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(cat);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {showCategoryDropdown && (
                <div className="absolute bottom-full mb-2 z-20 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
                  {allCategories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => toggleCategory(cat)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        readOnly
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span>{cat}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Fields will only appear in the category you choose here.
              </p>
            </div>
          )}

          <hr className="border-t border-gray-200" />

          {/* Hide from Filter Toggle */}
          <div className="flex items-start justify-between pt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Do not show in Products Filter Menu
              </label>
              <p className="text-xs text-gray-500">
                Hide this field from filter menu on your Online Store's products
                listing and category pages.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={hideInFilterMenu}
                onChange={() => setHideInFilterMenu(!hideInFilterMenu)}
              />
              <div className="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300" />
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-all duration-300" />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-8">
            <button
              onClick={onCancel}
              className="px-7 py-3 text-base font-semibold text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-7 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFieldForm;
