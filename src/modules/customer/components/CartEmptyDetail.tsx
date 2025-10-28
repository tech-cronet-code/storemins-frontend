// CartEmptyDetail.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "./CustomerLayout";
import { UserRoleName } from "../../auth/constants/userRoles";

const CartEmptyIllustration: React.FC = () => (
  <div className="w-full max-w-xs mx-auto">
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-auto"
    >
      <g opacity="0.2">
        <circle cx="50" cy="40" r="4" fill="#000" />
        <circle cx="70" cy="40" r="4" fill="#000" />
        <circle cx="90" cy="40" r="4" fill="#000" />
        <circle cx="50" cy="60" r="4" fill="#000" />
        <circle cx="70" cy="60" r="4" fill="#000" />
        <circle cx="90" cy="60" r="4" fill="#000" />

        <circle cx="230" cy="40" r="4" fill="#000" />
        <circle cx="250" cy="40" r="4" fill="#000" />
        <circle cx="270" cy="40" r="4" fill="#000" />
        <circle cx="230" cy="60" r="4" fill="#000" />
        <circle cx="250" cy="60" r="4" fill="#000" />
        <circle cx="270" cy="60" r="4" fill="#000" />
      </g>

      {/* Person pushing cart */}
      <path d="M180 120h80v80h-80z" fill="#1F2A44" rx="8" />
      <circle cx="220" cy="100" r="18" fill="#F23B3B" />
      <rect x="190" y="160" width="60" height="10" rx="3" fill="#F23B3B" />
      <rect x="190" y="140" width="60" height="15" rx="4" fill="#fff" />

      {/* Cart & character */}
      <g>
        <path
          d="M90 140c-11 0-20 9-20 20v10h80v-10c0-11-9-20-20-20H90z"
          fill="#1F2A44"
        />
        <circle cx="90" cy="135" r="20" fill="#1F2A44" />
        <circle cx="90" cy="100" r="16" fill="#F23B3B" />
      </g>
    </svg>
  </div>
);

const CartEmptyDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <main className="flex-grow bg-white min-h-[calc(100vh-80px)]">
        <div className="max-w-screen-xl mx-auto py-20 px-4 flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <CartEmptyIllustration />
          </div>
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold mb-2">
              Your Shopping Cart is Empty
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Start adding items to your cart to see them here.
            </p>
            <button
              onClick={() => navigate("/")} // adjust to your shop homepage route
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </main>
    </CustomerLayout>
  );
};

export default CartEmptyDetail;
