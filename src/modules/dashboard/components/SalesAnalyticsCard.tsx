// components/SalesAnalyticsCard.tsx
import React from "react";
import { Info } from "lucide-react";

interface SalesAnalyticsCardProps {
  title: string;
  value: string;
  highlight?: boolean;
  tooltipText?: string;
}

const SalesAnalyticsCard: React.FC<SalesAnalyticsCardProps> = ({
  title,
  value,
  highlight,
  tooltipText,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {title}
          {tooltipText && (
            <span className="relative group cursor-pointer">
              <Info className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition z-10 shadow-lg">
                {tooltipText}
              </span>
            </span>
          )}
        </p>
      </div>
      <p
        className={`text-[22px] leading-7 font-semibold mt-2 ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default SalesAnalyticsCard;
