import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../Schemas/productSchema";
import CategorySelectModal from "../categories/CategorySelectorModal";
import { useListCategoriesQuery } from "../../../auth/services/productApi";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";

interface ProductInfoSectionProps {
  productId?: string;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState("");

  const categoryLinks = watch("categoryLinks") || [];
  const { userDetails } = useSellerAuth();
  const businessId = userDetails?.storeLinks?.[0]?.businessId;

  const { data: categories = [], isLoading } = useListCategoriesQuery(
    { businessId: businessId! },
    { skip: !businessId }
  );

  // sync category names + ids when product/category changes
  useEffect(() => {
    if (!categories.length || !categoryLinks.length) return;

    const ids = categoryLinks.map(
      (link) => link.parentCategoryId || link.subCategoryId || ""
    );
    setSelectedCategoryIds(ids);

    const names = categoryLinks
      .map((link) => {
        if (link.parentCategoryId) {
          const match = categories.find(
            (cat) => cat.id === link.parentCategoryId
          );
          return match?.name;
        }
        if (link.subCategoryId) {
          const match = categories
            .flatMap((cat) => cat.subCategories || [])
            .find((sub) => sub.id === link.subCategoryId);
          return match?.name;
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");

    setSelectedCategoryNames(names);
  }, [categoryLinks, categories]);

  const handleSelectCategories = (categoryIds: string[]) => {
    const links: { parentCategoryId?: string; subCategoryId?: string }[] = [];

    categoryIds.forEach((id) => {
      const parent = categories.find((cat) => cat.id === id);
      if (parent) {
        links.push({ parentCategoryId: parent.id });
        return;
      }
      const sub = categories
        .flatMap((cat) => cat.subCategories || [])
        .find((s) => s.id === id);
      if (sub) {
        links.push({ subCategoryId: sub.id });
      }
    });

    setValue("categoryLinks", links, { shouldValidate: true });

    const names = links
      .map((link) => {
        const parent = link.parentCategoryId
          ? categories.find((cat) => cat.id === link.parentCategoryId)?.name
          : null;
        const sub = link.subCategoryId
          ? categories
              .flatMap((cat) => cat.subCategories || [])
              .find((s) => s.id === link.subCategoryId)?.name
          : null;
        return parent || sub || "";
      })
      .filter(Boolean)
      .join(", ");

    setSelectedCategoryNames(names);
    setSelectedCategoryIds(categoryIds);
    setModalOpen(false);
  };

  const handleAddNewCategory = () => {
    console.log("Add new category clicked");
  };

  // helper to get count from various backend shapes
  const getCount = (c: any): number =>
    Number(
      c?.productCount ??
        c?.productsCount ??
        c?._count?.products ??
        (Array.isArray(c?.products) ? c.products.length : 0) ??
        0
    ) || 0;

  const categoryOptions = (categories || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image ?? undefined,
    productCount: getCount(cat),
    subcategories:
      (cat.subCategories || []).map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        image: sub.image ?? undefined,
        productCount: getCount(sub),
      })) || [],
  }));

  const price = watch("price");
  const discountedPrice = watch("discountedPrice");

  const priceValue = Number(price ?? 0);
  const discountValue = Number(discountedPrice ?? 0);

  const hasValidPrices =
    !isNaN(priceValue) &&
    priceValue > 0 &&
    !isNaN(discountValue) &&
    discountValue > 0;

  const discountPercent =
    hasValidPrices && discountValue < priceValue
      ? Math.round(((priceValue - discountValue) / priceValue) * 100)
      : 0;

  if (!businessId) {
    return (
      <div className="text-center text-red-500">Business ID not found.</div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
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
            errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.name?.message && (
          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Category Input */}
      <div className="space-y-1">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Product Category <span className="text-red-500">*</span>
        </label>
        <input
          id="category"
          type="text"
          readOnly
          onClick={() => setModalOpen(true)}
          value={selectedCategoryNames}
          placeholder="Select categories"
          className={`w-full border ${
            errors.categoryLinks ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm cursor-pointer bg-gray-50 ${
            errors.categoryLinks ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.categoryLinks && (
          <p className="text-red-600 text-xs mt-1">
            At least one category must be selected.
          </p>
        )}
      </div>

      {/* Category Modal */}
      <CategorySelectModal
        open={modalOpen}
        categories={categoryOptions}
        selectedCategoryIds={selectedCategoryIds}
        onSelect={handleSelectCategories}
        onAddNewCategory={handleAddNewCategory}
        onClose={() => setModalOpen(false)}
        loading={isLoading}
      />

      {/* Price + Discount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              placeholder="Enter price"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                );
              }}
              className={`w-full pl-7 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                errors.price ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
          </div>
          {errors.price?.message && (
            <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="discountedPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
              ₹
            </span>
            <input
              id="discountedPrice"
              {...register("discountedPrice")}
              type="text"
              inputMode="numeric"
              placeholder="Enter discounted price"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                );
              }}
              className={`w-full pl-7 border ${
                errors.discountedPrice ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                errors.discountedPrice
                  ? "focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
          </div>
          {errors.discountedPrice?.message && (
            <p className="text-red-600 text-xs mt-1">
              {errors.discountedPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* Price Display */}
      {priceValue > 0 && (
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
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

      {/* Description */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Product Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={6}
          placeholder="Enter product description"
          className={`w-full border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm resize-none focus:ring-1 focus:outline-none ${
            errors.description ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.description?.message && (
          <p className="text-red-600 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfoSection;
