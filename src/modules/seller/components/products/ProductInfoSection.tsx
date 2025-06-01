import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../Schemas/productSchema";
import CategorySelectModal from "../categories/CategorySelectorModal";

// Dummy category list (replace with your API later)
const dummyCategories = [
  {
    id: "1",
    name: "Men",
    productCount: 20,
    image: "/images/men.png",
    subcategories: [
      {
        id: "1-1",
        name: "T-Shirts",
        productCount: 10,
        image: "/images/tshirt.png",
      },
      {
        id: "1-2",
        name: "Jeans",
        productCount: 10,
        image: "/images/jeans.png",
      },
    ],
  },
  {
    id: "2",
    name: "Women",
    productCount: 15,
    image: "/images/women.png",
    subcategories: [
      {
        id: "2-1",
        name: "Dresses",
        productCount: 5,
        image: "/images/dress.png",
      },
      {
        id: "2-2",
        name: "Skirts",
        productCount: 10,
        image: "/images/skirt.png",
      },
    ],
  },
];

const ProductInfoSection: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]); // updated here

  const categoryValue = watch("category");
  const price = watch("price");
  const discountPrice = watch("discountPrice");

  const priceValue = parseFloat(price || "");
  const discountValue = parseFloat(discountPrice || "");

  const hasValidPrices =
    !isNaN(priceValue) &&
    priceValue > 0 &&
    !isNaN(discountValue) &&
    discountValue > 0;

  const discountPercent =
    hasValidPrices && discountValue < priceValue
      ? Math.round(((priceValue - discountValue) / priceValue) * 100)
      : 0;

  const handleSelectCategories = (categoryIds: string[]) => {
    const selectedNames: string[] = [];

    dummyCategories.forEach((cat) => {
      if (categoryIds.includes(cat.id)) {
        selectedNames.push(cat.name);
      }

      cat.subcategories?.forEach((sub) => {
        if (categoryIds.includes(sub.id)) {
          selectedNames.push(sub.name);
        }
      });
    });

    setSelectedCategoryIds(categoryIds);
    setValue("category", selectedNames.join(", "), { shouldValidate: true }); // join names
    setModalOpen(false);
  };

  const handleAddNewCategory = () => {
    console.log("Add new category clicked");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Section Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Product Information
        </h3>
        <p className="text-sm text-gray-500">
          Easily input essential details like name, price, and more to showcase
          your product.
        </p>
      </div>

      {/* Product Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          {...register("name")}
          type="text"
          placeholder="Enter product name"
          className={`w-full border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
            errors.name
              ? "focus:ring-red-500 focus:border-red-500"
              : "focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {errors.name?.message && (
          <p className="text-red-600 text-xs mt-1">{errors.name?.message}</p>
        )}
      </div>

      {/* Product Category */}
      <div className="space-y-1">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Product Category <span className="text-red-500">*</span>
        </label>
        <input
          id="category"
          {...register("category")}
          type="text"
          value={categoryValue || ""}
          readOnly
          onClick={() => setModalOpen(true)}
          placeholder="Select categories"
          className={`w-full border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none cursor-pointer bg-gray-50 ${
            errors.category
              ? "focus:ring-red-500 focus:border-red-500"
              : "focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {errors.category?.message && (
          <p className="text-red-600 text-xs mt-1">
            {errors.category?.message}
          </p>
        )}
      </div>

      {/* 🟢 Reusable Modal */}
      <CategorySelectModal
        open={modalOpen}
        categories={dummyCategories}
        selectedCategoryIds={selectedCategoryIds} // updated here
        onSelect={handleSelectCategories} // updated here
        onAddNewCategory={handleAddNewCategory}
        onClose={() => setModalOpen(false)}
      />

      {/* Price and Discounted Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div className="space-y-1">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
              ₹
            </span>
            <input
              id="price"
              {...register("price")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter price"
              className={`w-full pl-7 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                errors.price
                  ? "focus:ring-red-500 focus:border-red-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
              }`}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                );
              }}
            />
          </div>
          {errors.price?.message && (
            <p className="text-red-600 text-xs mt-1">{errors.price?.message}</p>
          )}
        </div>

        {/* Discount Price */}
        <div className="space-y-1">
          <label
            htmlFor="discountPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Discounted Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
              ₹
            </span>
            <input
              id="discountPrice"
              {...register("discountPrice")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter discounted price"
              className={`w-full pl-7 border ${
                errors.discountPrice ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                errors.discountPrice
                  ? "focus:ring-red-500 focus:border-red-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
              }`}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                );
              }}
            />
          </div>
          {errors.discountPrice?.message && (
            <p className="text-red-600 text-xs mt-1">
              {errors.discountPrice?.message}
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Price Display */}
      {priceValue > 0 && (
        <div className="mt-2 flex items-center flex-wrap gap-2 text-sm font-medium">
          <span className="text-gray-700">Price:</span>
          {discountValue > 0 && discountValue < priceValue ? (
            <>
              <span className="text-gray-900">₹{discountValue}</span>
              <span className="line-through text-gray-500">₹{priceValue}</span>
              <span className="text-white bg-orange-500 text-xs px-2 py-1 rounded font-semibold">
                {discountPercent}% OFF
              </span>
            </>
          ) : (
            <span className="text-gray-900">₹{priceValue}</span>
          )}
        </div>
      )}

      {/* Product Description */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Product Description
        </label>
        <p className="text-sm text-gray-500">
          Get high quality product descriptions within seconds!{" "}
          <button
            type="button"
            className="text-blue-600 font-medium underline hover:opacity-80"
          >
            Get description.
          </button>
        </p>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Enter product description"
          rows={6}
          className={`w-full border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm resize-none focus:ring-1 focus:outline-none ${
            errors.description
              ? "focus:ring-red-500 focus:border-red-500"
              : "focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {errors.description?.message && (
          <p className="text-red-600 text-xs mt-1">
            {errors.description?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfoSection;
