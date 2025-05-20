import React, { useState } from "react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { Store, X, Copy, Check } from "lucide-react";

interface StoreLinkCardProps {
  storeUrl: string;
  suggestedDomain: string;
  onCopy?: () => void;
  onClose?: () => void;
  onShare?: (platform: "whatsapp" | "facebook") => void;
  onGetNow?: () => void;
}

const StoreLinkCard: React.FC<StoreLinkCardProps> = ({
  storeUrl,
  suggestedDomain,
  onCopy,
  onClose,
  onShare,
  onGetNow,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-md transition hover:shadow-lg">
      {/* Top Row */}
      <div className="flex items-center justify-between flex-wrap gap-y-2 gap-x-3 bg-[#f5f7ff] px-5 py-3 rounded-full">
        {/* Label */}
        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
          Your Store Link
        </span>

        {/* Link box */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm transition hover:shadow-inner flex-1 min-w-[200px] max-w-[450px] overflow-hidden">
          <Store className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-700 hover:underline truncate"
          >
            {storeUrl.replace(/^https?:\/\//, "")}
          </a>
          <button
            onClick={handleCopyClick}
            className={`ml-auto transition ${
              copied ? "text-green-600" : "text-gray-500 hover:text-blue-600"
            }`}
            title={copied ? "Copied!" : "Copy"}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Share Via label */}
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
          Share Via -
        </span>

        {/* Action icons */}
        <div className="flex items-center  gap-2 lg:gap-4">
          <button
            className="p-2 rounded-full bg-gradient-to-tr from-green-400 to-green-500 text-white shadow hover:scale-105 hover:shadow-md transition"
            onClick={() => onShare?.("whatsapp")}
            title="Share on WhatsApp"
          >
            <FaWhatsapp className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 text-white shadow hover:scale-105 hover:shadow-md transition"
            onClick={() => onShare?.("facebook")}
            title="Share on Facebook"
          >
            <FaFacebookF className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-full bg-gray-200 text-gray-600 shadow hover:bg-gray-300 hover:scale-105 hover:shadow-md transition"
            onClick={onClose}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm pt-5 mt-4 border-t border-gray-100">
        <p className="text-gray-700 text-center sm:text-left">
          Your domain{" "}
          <span className="font-semibold text-black">{suggestedDomain}</span> is
          available
        </p>
        <button
          onClick={onGetNow}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-md shadow transition duration-200"
        >
          Get Now
        </button>
      </div>
    </div>
  );
};

export default StoreLinkCard;
