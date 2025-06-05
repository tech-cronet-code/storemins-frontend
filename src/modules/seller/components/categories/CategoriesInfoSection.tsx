import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../../auth/contexts/AuthContext";
import { useSellerProduct } from "../../hooks/useSellerProduct";
import { CategoriesFormValues } from "../../Schemas/CategoriesSchema";

interface CategoriesInfoSectionProps {
  categoryId?: string;
  type?: "PARENT" | "SUB";
}

const CategoriesInfoSection: React.FC<CategoriesInfoSectionProps> = ({
  categoryId,
  type,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CategoriesFormValues>();

  const isSubcategory = watch("isSubcategory");
  const parentCategory = watch("category");

  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    parentCategory || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const modalRef = useRef<HTMLDivElement | null>(null);

  const { userDetails } = useAuth();
  const { listCategories } = useSellerProduct();

  console.log(listCategories, "listCategories");

  // 🛠️ Fetch Categories
  const fetchCategories = useCallback(async () => {
    const businessId = userDetails?.storeLinks?.[0]?.businessId;
    console.log(businessId, "businessId");

    if (businessId) {
      try {
        const result = await listCategories({ businessId }).unwrap();
        console.log(result, "👉 API response");

        // ✅ No categoryType, use a better condition
        const parentCategories = result.filter(
          (cat) =>
            Array.isArray(cat.subCategories) && cat.subCategories.length >= 0
        );
        console.log(parentCategories, "👉 Filtered Parent Categories");

        setCategories(
          parentCategories.map((cat) => ({ id: cat.id, name: cat.name }))
        );
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }
  }, [userDetails?.storeLinks, listCategories]);

  useEffect(() => {
    if (showModal) {
      fetchCategories();
    }
  }, [fetchCategories, showModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // 🧠 Filtered Search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredCategories, "filteredCategories");

  // const isEditParent = !!categoryId && type === "PARENT";
  const isEditSub = !!categoryId && type === "SUB";

  return (
    <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
      <h3 className="text-base font-semibold text-gray-900">Information</h3>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {isSubcategory ? "Subcategory Image" : "Category Image"}
        </label>
        <label
          htmlFor="image-upload"
          className="w-[100px] h-[100px] border-2 border-dashed border-blue-500 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-50 transition"
        >
          <span className="text-blue-500 text-2xl font-light">+</span>
        </label>
        <input
          id="image-upload"
          type="file"
          {...register("image")}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Category Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {isSubcategory ? "Subcategory Name" : "Category Name"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          {...register("name")}
          type="text"
          placeholder={
            isSubcategory ? "Enter subcategory name" : "Enter category name"
          }
          className={`w-full border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
            errors.name
              ? "focus:ring-red-500 focus:border-red-500"
              : "focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {errors.name?.message && (
          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Parent Category */}
      {isSubcategory && (
        <div className="space-y-1">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Parent Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            value={
              categories.find((cat) => cat.id === parentCategory)?.name || ""
            }
            onClick={() => setShowModal(true)}
            readOnly
            placeholder="Select category"
            className={`cursor-pointer w-full border ${
              errors.category ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
              errors.category
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
          />
          {errors.category?.message && (
            <p className="text-red-600 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      )}

      {/* Add as Subcategory */}
      <div className="flex items-center space-x-2 pt-1">
        <input
          type="checkbox"
          id="isSubcategory"
          {...register("isSubcategory")}
          className="rounded border-gray-300"
          disabled={isEditSub}
          checked={isSubcategory || !!parentCategory}
        />
        <label
          htmlFor="isSubcategory"
          className={`text-sm ${
            isEditSub ? "text-gray-400 cursor-not-allowed" : "text-gray-700"
          }`}
          title={
            isEditSub
              ? "You are editing a subcategory, this cannot be changed."
              : ""
          }
        >
          Add as subcategory
        </label>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            ref={modalRef}
            className="bg-white rounded-lg w-[600px] shadow-xl ring-1 ring-black/5 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Select parent category
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <label
                    key={cat.id}
                    className={`flex justify-between items-center px-6 py-4 cursor-pointer transition-colors ${
                      selectedCategoryId === cat.id
                        ? "bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src="/img/category-placeholder.png"
                        alt="Category"
                        className="w-12 h-12 rounded-md object-cover border border-gray-200"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {cat.name}
                        </span>
                        <span className="text-xs text-gray-500">1 product</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="selectedCategory"
                      checked={selectedCategoryId === cat.id}
                      onChange={() => setSelectedCategoryId(cat.id)}
                      className="w-4 h-4 accent-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                    />
                  </label>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No categories found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setValue("category", selectedCategoryId);
                  setShowModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2.5 rounded-md font-medium"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesInfoSection;
