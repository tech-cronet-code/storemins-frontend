import React from "react";
import { FaTags } from "react-icons/fa";

interface CouponsCardProps {
  onClick: () => void;
}

export const CouponsCard: React.FC<CouponsCardProps> = ({ onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
  >
    <div className="flex items-center gap-3">
      {/* Green coupon icon */}
      <FaTags className="text-green-600 text-xl flex-shrink-0" />
      <div>
        <div className="font-medium text-sm">Coupons and offers</div>
        <div className="text-xs text-gray-500">
          Save more with coupon and offers
        </div>
      </div>
    </div>
    <div className="text-blue-600 font-medium text-sm">Apply &gt;</div>
  </div>
);
