import React from "react";
import { useFormContext } from "react-hook-form";

const ProductInfoSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        Product Information
      </h3>

      {/* Product Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          id="name"
          {...register("name")}
          type="text"
          placeholder="Enter product name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          id="category"
          {...register("category")}
          type="text"
          placeholder="Enter product category"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.category && (
          <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Price & Discount Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            id="price"
            {...register("price")}
            type="number"
            placeholder="e.g. 1999"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.price && (
            <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="discountPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Price
          </label>
          <input
            id="discountPrice"
            {...register("discountPrice")}
            type="number"
            placeholder="e.g. 1499"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.discountPrice && (
            <p className="text-red-600 text-xs mt-1">
              {errors.discountPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Enter product description"
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.description && (
          <p className="text-red-600 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfoSection;
