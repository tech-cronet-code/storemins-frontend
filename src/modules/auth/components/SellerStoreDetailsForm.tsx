// src/components/SellerStoreDetailsForm.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  SellerStoreDetailsFormValues,
  sellerStoreDetailsSchema,
} from "../schemas/sellerStoreDetailsSchema";
import {
  BusinessCategoryResponseDto
} from "../types/businessStoreTypes";

interface Props {
  onSubmit: (data: SellerStoreDetailsFormValues) => Promise<void>;
  loading: boolean;
  error?: string;
  logout: () => void;

  /** now passed in from the container: */
  // businessTypes: BusinessTypeResponseDto[];
  businessCategories: BusinessCategoryResponseDto[];
}

const SellerStoreDetailsForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error,
  logout,
  // businessTypes,
  businessCategories,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SellerStoreDetailsFormValues>({
    resolver: zodResolver(sellerStoreDetailsSchema),
  });

  const [customCategory, setCustomCategory] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setValue("categoryId", cat);
  };

  const handleAddCategory = () => {
    if (newCategoryInput.trim()) {
      setCustomCategory(newCategoryInput.trim());
      handleCategoryClick(newCategoryInput.trim());
      setShowAddCategoryModal(false);
      setNewCategoryInput("");
    }
  };

  return (
    <>
      {showAddCategoryModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
          onClick={() => setShowAddCategoryModal(false)}
        >
          <div
            className="bg-white rounded-md p-6 w-full max-w-sm shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">Add New Category</h2>
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className="form-input-style w-full mb-4"
              placeholder="Enter new category"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded-md border text-gray-600"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1 rounded-md bg-[#7F56D9] text-white"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center sm:pt-3 pt-1">
        <h3 className="text-2xl font-semibold text-[#0B132A]">
          Let’s begin to set you up!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          please add your business information to get started
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            {...register("businessName")}
            placeholder="khan bakery"
            className="form-input-style w-full"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm">
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Business Type */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Type
          </label>
          <select
            {...register("businessTypeId")}
            className="form-input-style w-full"
          >
            <option value="">Select Type</option>
            {businessTypes.map((bt) => (
              <option key={bt.id} value={bt.id}>
                {bt.name}
              </option>
            ))}
          </select>
          {errors.businessTypeId && (
            <p className="text-red-500 text-sm">
              {errors.businessTypeId.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            you can always change it later!
          </p>
        </div> */}

        {/* hidden field to carry the selected category */}
        <input type="hidden" {...register("categoryId")} />

        {/* Category Tags */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            What’s your site <span className="text-[#7F56D9]">primarily</span>{" "}
            about?
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            You can always change it later!
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            {customCategory && (
              <button
                type="button"
                className={`px-4 py-1 rounded-full text-sm font-medium border ${
                  selectedCategory === customCategory
                    ? "bg-[#7F56D9] text-white border-[#7F56D9]"
                    : "border-gray-300 text-gray-700 hover:border-[#7F56D9] hover:text-[#7F56D9]"
                }`}
                onClick={() => handleCategoryClick(customCategory)}
              >
                {customCategory}
              </button>
            )}

            {businessCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`px-4 py-1 rounded-full text-sm font-medium border ${
                  selectedCategory === cat.id
                    ? "bg-[#7F56D9] text-white border-[#7F56D9]"
                    : "border-gray-300 text-gray-700 hover:border-[#7F56D9] hover:text-[#7F56D9]"
                }`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </button>
            ))}

            <button
              type="button"
              className="px-4 py-1 border border-dashed border-orange-500 text-orange-500 rounded-full text-sm font-medium"
              onClick={() => setShowAddCategoryModal(true)}
            >
              + Add category
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-[#7F56D9] text-white font-semibold hover:bg-[#6d45c8] transition"
          disabled={loading}
        >
          {loading ? "Nexting in..." : "Next"}
        </button>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <p className="text-center text-sm font-light">
          Not right now?{" "}
          <button className="text-[#7F56D9] font-medium" onClick={logout}>
            Logout
          </button>
        </p>
      </form>
    </>
  );
};

export default SellerStoreDetailsForm;
