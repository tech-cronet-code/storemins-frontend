import React, { useMemo, useState } from "react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { Store, X, Copy, Check } from "lucide-react";

interface StoreLinkCardProps {
  storeUrl: string; // can be a full URL or just a slug/path
  suggestedDomain: string;
  onCopy?: () => void; // optional: called after copy
  onClose?: () => void;
  onShare?: (platform: "whatsapp" | "facebook") => void; // optional: called after share
  onGetNow?: () => void;
}

const LOCAL_PORT = 5173;

/** Build a user-facing URL.
 * Rules:
 * - If we're on localhost -> always show http://localhost:5173/<slug>
 * - Else show whatever full URL was provided
 * - If only a slug/path was provided, compose with localhost in dev or VITE_PUBLIC_STORE_BASE in prod.
 */
function resolveDisplayUrl(raw: string): string {
  const isBrowser = typeof window !== "undefined";
  const isLocalHost =
    isBrowser &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  // Extract slug from either a full URL or a plain slug/path
  const extractSlug = (input: string) => {
    try {
      const u = new URL(input);
      return u.pathname.replace(/^\/+/, "");
    } catch {
      return input.replace(/^https?:\/\//, "").replace(/^\/+/, "");
    }
  };

  const slug = extractSlug(raw);

  if (isLocalHost) {
    const proto = isBrowser ? window.location.protocol : "http:";
    return `${proto}//localhost:${LOCAL_PORT}/${slug}`;
  }

  // If raw is already a full URL, keep it
  try {
    const u = new URL(raw);
    return u.toString();
  } catch {
    // Not a full URL -> try env base, then https://
    const base = (import.meta as any)?.env?.VITE_PUBLIC_STORE_BASE;
    if (base) return `${String(base).replace(/\/+$/, "")}/${slug}`;
    return `https://${slug}`;
  }
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

  // ✅ Single source of truth for what the user sees & uses
  const displayUrl = useMemo(() => resolveDisplayUrl(storeUrl), [storeUrl]);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = displayUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (platform: "whatsapp" | "facebook") => {
    const encoded = encodeURIComponent(displayUrl);
    const url =
      platform === "whatsapp"
        ? `https://wa.me/?text=${encoded}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onShare?.(platform);
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
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-700 hover:underline truncate"
          >
            {displayUrl.replace(/^https?:\/\//, "")}
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
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            className="p-2 rounded-full bg-gradient-to-tr from-green-400 to-green-500 text-white shadow hover:scale-105 hover:shadow-md transition"
            onClick={() => handleShare("whatsapp")}
            title="Share on WhatsApp"
          >
            <FaWhatsapp className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 text-white shadow hover:scale-105 hover:shadow-md transition"
            onClick={() => handleShare("facebook")}
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
