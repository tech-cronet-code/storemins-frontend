// ProductCard.tsx
import React from "react";

export interface Product {
  id: string;
  name: string;
  price: number; // current price
  originalPrice?: number; // optional, for discount
  imageUrl?: string;
  onAdd?: (product: Product) => void;
}

const formatPrice = (p: number) => {
  return `₹${p.toLocaleString("en-IN")}`;
};

const calcDiscountPercent = (original: number, current: number) => {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? calcDiscountPercent(product.originalPrice!, product.price)
    : 0;

  return (
    <div className="flex flex-col h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Image + title + price */}
      <div className="flex-1 p-3 flex flex-col">
        <div className="relative w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain w-full h-full"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Cpath d='M20 30h60v40H20z' fill='%23d1d5db'/%3E%3Ccircle cx='60' cy='50' r='12' fill='%23f3f4f6'/%3E%3C/svg%3E";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg
                width="40"
                height="32"
                viewBox="0 0 64 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="64" height="52" rx="8" fill="#F0F0F0" />
                <path
                  d="M32 20C28.6863 20 26 17.3137 26 14C26 10.6863 28.6863 8 32 8C35.3137 8 38 10.6863 38 14C38 17.3137 35.3137 20 32 20ZM20 44C20 35.1634 27.1634 28 36 28H28C36.8366 28 44 35.1634 44 44H20Z"
                  fill="#D1D5DB"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="mt-3 flex-1">
          <div
            className="text-sm font-medium text-gray-900 mb-1 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
            }}
            title={product.name}
          >
            {product.name}
          </div>

          <div className="flex flex-wrap items-baseline gap-2 text-sm">
            <div className="text-lg font-semibold text-black">
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <>
                <div className="line-through text-gray-400 text-xs">
                  {formatPrice(product.originalPrice!)}
                </div>
                <div className="text-red-600 font-medium text-xs">
                  ({discountPercent}% OFF)
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => product.onAdd?.(product)}
          className="w-full flex items-center justify-center gap-1 border border-red-600 text-red-600 rounded-md px-3 py-2 text-sm font-semibold hover:bg-red-50 transition"
          aria-label={`Add ${product.name}`}
        >
          <span className="text-lg leading-none">+</span>
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
