// components/CartItem.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";

export interface CartProduct {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  size?: string | number;
  color?: { id: string; name: string; hex: string };
  quantity: number;
  // optional available options
  availableSizes?: (string | number)[];
  availableColors?: { id: string; name: string; hex: string }[];
}

interface CartItemProps {
  product: CartProduct;
  onChangeQuantity: (id: string, qty: number) => void;
  onChangeSize: (id: string, size: string | number) => void;
  onChangeColor: (id: string, color: CartProduct["color"]) => void;
  onRemove: (id: string) => void;
}

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

const calcDiscountPercent = (original: number, current: number) => {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
};

const CartItem: React.FC<CartItemProps> = ({
  product,
  onChangeQuantity,
  onChangeSize,
  onChangeColor,
  onRemove,
}) => {
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const discountPercent = useMemo(
    () =>
      hasDiscount
        ? calcDiscountPercent(product.originalPrice!, product.price)
        : 0,
    [hasDiscount, product.originalPrice, product.price]
  );

  const savedAmount = useMemo(
    () => (hasDiscount ? product.originalPrice! - product.price : 0),
    [hasDiscount, product.originalPrice, product.price]
  );

  // Size dropdown fallback list
  const sizes = product.availableSizes ?? ["30", "20", "10"];

  // Color dropdown with fallback
  const colors = product.availableColors ?? [
    { id: "green", name: "Green", hex: "#15803d" },
    { id: "brown", name: "Brown", hex: "#9f1d1d" },
  ];

  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement | null>(null);

  // close color dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        colorOpen &&
        colorRef.current &&
        !colorRef.current.contains(e.target as Node)
      ) {
        setColorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorOpen]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col md:flex-row gap-4 p-4">
      {/* Image */}
      <div className="flex-shrink-0 w-[120px] h-[120px] rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border">
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
          <div className="text-gray-400 flex flex-col items-center justify-center">
            <svg
              width="40"
              height="32"
              viewBox="0 0 64 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Title + remove */}
        <div className="flex justify-between items-start">
          <div
            className="text-sm font-medium text-gray-900 pr-4"
            style={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              display: "-webkit-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.name}
          </div>
          <button
            onClick={() => onRemove(product.id)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
            aria-label="Remove"
          >
            REMOVE
          </button>
        </div>

        {/* Price row */}
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-semibold text-black">
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <>
                <div className="line-through text-gray-400 text-sm">
                  {formatPrice(product.originalPrice!)}
                </div>
                <div className="text-orange-600 text-sm">
                  ({discountPercent}% off)
                </div>
              </>
            )}
          </div>
        </div>

        {/* Saved amount */}
        {hasDiscount && (
          <div className="mt-1 text-sm text-green-600 font-medium">
            You saved {formatPrice(savedAmount)}
          </div>
        )}

        {/* Options */}
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          {/* size */}
          <div className="flex items-center gap-2">
            <span className="font-medium">size:</span>
            <select
              value={product.size ?? ""}
              onChange={(e) => onChangeSize(product.id, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              aria-label="Select size"
            >
              <option value="" disabled>
                Select
              </option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* color with dropdown */}
          <div
            className="flex items-center gap-2 relative"
            ref={(el) => (colorRef.current = el)}
          >
            <span className="font-medium">color:</span>
            <div className="relative">
              <button
                type="button"
                aria-label="Select color"
                onClick={() => setColorOpen((o) => !o)}
                className="flex items-center gap-1 border rounded px-2 py-1 text-sm"
              >
                <div
                  style={{
                    backgroundColor: product.color?.hex || "#ffffff",
                  }}
                  className="w-4 h-4 rounded-sm border"
                />
                <span className="ml-1">
                  {product.color ? product.color.name : "Select"}
                </span>
                <svg
                  className="ml-1"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {colorOpen && (
                <div className="absolute z-30 mt-1 w-[140px] bg-white border border-gray-200 rounded shadow-lg overflow-hidden">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onChangeColor(product.id, c);
                        setColorOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <div
                        style={{ backgroundColor: c.hex }}
                        className="w-4 h-4 rounded-sm border"
                      />
                      <div className="flex-1 text-left">{c.name}</div>
                      {product.color?.id === c.id && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* quantity */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Qty:</span>
            <select
              value={product.quantity}
              onChange={(e) =>
                onChangeQuantity(product.id, Number(e.target.value))
              }
              className="border rounded px-2 py-1 text-sm"
              aria-label="Quantity"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
