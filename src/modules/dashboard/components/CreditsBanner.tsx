// components/CreditsBanner.tsx
import React from "react";

interface CreditsBannerProps {
  credits: number;
  onBuyCredits: () => void;
}

const CreditsBanner: React.FC<CreditsBannerProps> = ({
  credits,
  onBuyCredits,
}) => {
  return (
    <div className="bg-orange-50 border border-orange-100 text-gray-800 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm mb-2">
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rotate-45 bg-orange-50"></div>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-black leading-none">
            {credits} Credits
          </p>
          <p className="text-gray-600 text-xs mt-0.5">
            Customers won't receive order SMS when wallet balance hits 0
          </p>
        </div>
      </div>

      {/* Right: Button */}
      <button
        onClick={onBuyCredits}
        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Buy Credits
      </button>
    </div>
  );
};

export default CreditsBanner;
