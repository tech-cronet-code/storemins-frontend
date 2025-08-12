import React, { useState } from "react";
import { CouponsCard } from "./CouponsCard";
import { CouponModal } from "./CouponModal";

interface CartSummaryProps {
  subtotal: number;
  originalSubtotal: number;
  fee: number;
  taxPercent: number;
  onContinue?: () => void; // only provided on steps 1 & 2
}

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  originalSubtotal,
  fee,
  taxPercent,
  onContinue,
}) => {
  const [isCouponOpen, setCouponOpen] = useState(false);

  const savings = Math.max(0, originalSubtotal - subtotal);
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  const grandTotal = subtotal + fee + taxAmount;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* 1. Coupons & offers */}
      <div className="p-4 border-b border-gray-200">
        <CouponsCard onClick={() => setCouponOpen(true)} />
      </div>

      {/* 2. Price breakdown */}
      <div className="p-4 flex-1 space-y-3 text-sm">
        {/* Item total */}
        <div className="flex justify-between items-center">
          <span>Item total</span>
          <div className="flex items-center gap-2">
            {originalSubtotal > subtotal && (
              <span className="line-through text-gray-400">
                {formatPrice(originalSubtotal)}
              </span>
            )}
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
        </div>
        {/* Tax */}
        <div className="flex justify-between">
          <span>Tax ({taxPercent}%)</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
        {/* Delivery fee */}
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span className="font-medium">
            {fee === 0 ? "FREE" : formatPrice(fee)}
          </span>
        </div>
      </div>

      {/* 3. Grand total */}
      <div className="px-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-baseline text-base font-semibold">
          <span>Grand total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
      </div>

      {/* 4. Delivery & savings */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-600">
          Average delivery time: <span className="font-medium">3-5 days</span>
        </p>
        {savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm text-green-800">
            You saved {Math.round((savings / originalSubtotal) * 100)}% (
            {formatPrice(savings)}) on this order.
          </div>
        )}
      </div>

      {/* 5. Continue button (only if onContinue is passed) */}
      {onContinue && (
        <div className="p-4 bg-gray-50">
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
          >
            Continue
          </button>
        </div>
      )}

      {/* 6. Coupon modal */}
      <CouponModal
        isOpen={isCouponOpen}
        onClose={() => setCouponOpen(false)}
        onApplyCode={(code) => {
          console.log("apply coupon:", code);
          setCouponOpen(false);
        }}
      />
    </div>
  );
};

export default CartSummary;
