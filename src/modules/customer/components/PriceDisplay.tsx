// PriceDisplay.tsx
import React from "react";

export interface PriceProps {
  price: number;
  originalPrice?: number;
}

const formatINR = (v: number) => `₹${v.toLocaleString("en-IN")}`;

const calcDiscountPercent = (original: number, current: number) => {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
};

const PriceDisplay: React.FC<PriceProps> = ({ price, originalPrice }) => {
  const hasDiscount = typeof originalPrice === "number" && originalPrice > price;
  const discountPercent = hasDiscount
    ? calcDiscountPercent(originalPrice!, price)
    : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-2 mb-1">
      <div className="text-3xl font-semibold">{formatINR(price)}</div>
      {hasDiscount && (
        <>
          <div className="line-through text-gray-400 text-sm">
            {formatINR(originalPrice!)}
          </div>
          <div className="text-orange-500 font-medium text-sm">
            ({discountPercent}% OFF)
          </div>
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
