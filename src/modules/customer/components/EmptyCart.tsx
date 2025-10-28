import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyCart: React.FC = () => {
  const nav = useNavigate();
  return (
    <div className="flex flex-col items-center py-16 px-4">
      {/* Illustration */}
      <svg
        className="w-32 h-32 text-gray-300 mb-6"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="12"
          y="12"
          width="40"
          height="40"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M20 20h24v24H20z" fill="currentColor" fillOpacity="0.1" />
        <path
          d="M28 28 L36 36 M36 28 L28 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Message */}
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">
        Looks like you haven’t made your choice yet…
      </p>

      {/* Back to homepage */}
      <button
        onClick={() => nav("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition"
      >
        Back to homepage
      </button>
    </div>
  );
};

export default EmptyCart;
