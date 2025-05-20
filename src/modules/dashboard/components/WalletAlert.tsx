import React, { useState } from "react";
import { Info, X } from "lucide-react";

interface WalletAlertProps {
  onAddCredits?: () => void;
  onLearnMore?: () => void;
  className?: string;
  defaultVisible?: boolean;
}

const WalletAlert: React.FC<WalletAlertProps> = ({
  onAddCredits,
  onLearnMore,
  className = "",
  defaultVisible = true,
}) => {
  const [show, setShow] = useState(defaultVisible);

  if (!show) return null;

  return (
    <div
      className={`flex items-start justify-between bg-orange-50 border border-orange-200 rounded px-4 py-3 shadow-sm relative ${className}`}
    >
      {/* Left: Icon and Message */}
      <div className="flex items-start gap-3 pr-8">
        <div className="pt-1">
          <Info className="h-4 w-4 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-700 mb-0.5">
            Wallet Balance Low
          </p>
          <p className="text-sm text-orange-700">
            To ensure seamless payouts and order updates, please maintain at
            least 2500 credits in your Dukaan Wallet.
          </p>
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex gap-2 flex-shrink-0 mt-2 sm:mt-0">
        <button
          onClick={onLearnMore}
          className="flex items-center gap-1 border border-gray-300 bg-white text-sm px-3 py-1.5 rounded hover:bg-gray-50 transition"
        >
          <span>Learn more</span>
        </button>

        <button
          onClick={onAddCredits}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded transition"
        >
          + Add credits
        </button>
      </div>

      <button
        onClick={() => setShow(false)}
        className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 z-10 border border-orange-200 hover:bg-orange-100 transition"
      >
        <X className="h-4 w-4 text-orange-500" />
      </button>
    </div>
  );
};

export default WalletAlert;
