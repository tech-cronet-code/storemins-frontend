// TrustBadges.tsx
import React from "react";

const TrustBadges: React.FC = () => (
  <div className="flex flex-wrap gap-6 mt-6 mb-4 text-sm text-gray-700">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M9.5 11l2.5 2 4-4"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className="font-semibold">Secure Checkout</div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2a7 7 0 0 1 7 7v5a7 7 0 1 1-14 0V9a7 7 0 0 1 7-7z"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 14l2 2 4-4"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className="font-semibold">Satisfaction Guaranteed</div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      <div>
        <div className="font-semibold">Privacy Protected</div>
      </div>
    </div>
  </div>
);

export default TrustBadges;
