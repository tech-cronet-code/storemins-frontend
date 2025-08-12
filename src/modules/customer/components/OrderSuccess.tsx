// src/components/OrderSuccess.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center w-full max-w-lg">
        {/* 1. Check icon */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 10l-4.5 4.5L8 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 2. Headline */}
        <h1 className="text-2xl font-semibold mb-2">
          Your order is successful!
        </h1>

        {/* 3. Sub-text */}
        <p className="text-gray-600 mb-8">
          You will receive a confirmation message shortly. For more details,
          check order status on your WhatsApp.
        </p>

        {/* 4. Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            Track order
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
