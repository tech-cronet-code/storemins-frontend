// components/CartItemsSection.tsx
import React, { useMemo } from "react";
import CartItem, { CartProduct } from "./CartItem";

interface CartItemsSectionProps {
  cart: CartProduct[];
  onChangeQuantity: (id: string, qty: number) => void;
  onChangeSize: (id: string, size: string | number) => void;
  onChangeColor: (id: string, color: CartProduct["color"]) => void;
  onRemove: (id: string) => void;
  subtotal: number;
  originalSubtotal: number;
  fee: number;
  taxPercent: number;
}

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

const CartItemsSection: React.FC<CartItemsSectionProps> = ({
  cart,
  onChangeQuantity,
  onChangeSize,
  onChangeColor,
  onRemove,
  subtotal,
  originalSubtotal,
  fee,
  taxPercent,
}) => {
  const totalSavings = Math.max(0, originalSubtotal - subtotal);
  const savingsPercent =
    originalSubtotal > 0
      ? Math.round(((originalSubtotal - subtotal) / originalSubtotal) * 100)
      : 0;

  const grandTotal = useMemo(() => {
    const taxAmount = Math.round((subtotal * taxPercent) / 100);
    const grand = subtotal + fee + taxAmount;
    return `₹${grand.toLocaleString("en-IN")}`;
  }, [subtotal, fee, taxPercent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
        <h1 className="text-xl font-semibold m-0">
          Shopping cart ({cart.length} Item{cart.length !== 1 && "s"})
        </h1>
        <div className="text-lg font-semibold mt-1 sm:mt-0">
          Total <span aria-label="grand total">{grandTotal}</span>
        </div>
      </div>

      {/* Savings banner */}
      {totalSavings > 0 && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm text-green-800">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <div className="flex-1">
            You saved total {savingsPercent}% ({formatPrice(totalSavings)}) on
            this order.
          </div>
        </div>
      )}

      {/* Items or empty state */}
      {cart.length === 0 ? (
        <div className="py-12 text-center text-gray-600 bg-gray-50 rounded-md border border-dashed">
          <p className="mb-1 font-medium text-lg">
            Your shopping cart is empty.
          </p>
          <p className="text-sm">
            Start adding some products to see them here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200">
          {cart.map((p) => (
            <div key={p.id} className="pb-4">
              <CartItem
                product={p}
                onChangeQuantity={onChangeQuantity}
                onChangeSize={onChangeSize}
                onChangeColor={onChangeColor}
                onRemove={onRemove}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartItemsSection;
