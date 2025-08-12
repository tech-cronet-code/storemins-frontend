// components/CouponModal.tsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  onApplyCode,
}) => {
  const [code, setCode] = useState("");

  // create portal container
  const [el] = useState(() => document.createElement("div"));
  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="
        fixed
        top-1/2 left-1/2
        z-50
        w-full max-w-md
        -translate-x-1/2 -translate-y-1/2
        px-4
      "
    >
      <div className="relative bg-white rounded-lg shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        {/* Title */}
        <h3 className="text-lg font-medium mb-4">Coupons and offers</h3>

        {/* Input + Apply */}
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden mb-6">
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-3 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => {
              onApplyCode(code);
              setCode("");
            }}
            disabled={!code.trim()}
            className="px-4 py-3 font-medium text-orange-400 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center">
          <img
            src="https://unpkg.com/heroicons@2.0.18/24/outline/percent.svg"
            alt="No coupons"
            className="w-32 h-32 mb-3 opacity-50"
          />
          <span className="text-gray-500">No coupons found</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, el);
};
