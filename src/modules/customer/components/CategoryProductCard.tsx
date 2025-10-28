// src/components/CategoryProductCard.tsx
import React, { useState } from "react";
import { CartProduct } from "./CartItem";

interface CategoryProductCardProps
  extends Omit<CartProduct, "quantity" | "size" | "color"> {
  onAdd: () => void;
}

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

const CategoryProductCard: React.FC<CategoryProductCardProps> = ({
  name,
  imageUrl,
  price,
  originalPrice,
  onAdd,
}) => {
  const [imgError, setImgError] = useState(false);

  // Calculate discount percentage
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/** ▶▶ IMAGE WRAPPER: enforces 1:1 aspect ratio and gray background */}
      <div className="relative w-full h-50 bg-gray-100 overflow-hidden">
        {/** if URL is present and loaded OK, show <img>, else show placeholder */}
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            {/** simple SVG “ghost” icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/** ▶▶ DETAILS */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={onAdd}
          className="
            mt-auto
            py-2
            rounded-md
            text-sm
            font-semibold
            text-white
            bg-red-500
            hover:bg-red-600
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            transition-colors
          "
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CategoryProductCard;
