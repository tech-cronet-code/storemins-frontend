import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FaFacebookF, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { BiLink } from "react-icons/bi"; // or any link icon

interface OrderShareModalProps {
  visible: boolean;
  onClose: () => void;
  type?: string;
  title?: string;
  message?: string;
}

const OrderShareModal: React.FC<OrderShareModalProps> = ({
  visible,
  onClose,
  type = "product",
  title = "",
  message
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        ref={modalRef}
        className="bg-white rounded-md px-6 py-5 shadow-xl relative w-full max-w-[340px]"
      >
        {/* Header */}
        <h2 className="text-lg font-semibold text-center">
          {message || `Share ${type === "category" ? "Category" : "Product"}`}
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1 truncate max-w-xs mx-auto">
          {title}
        </p>

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6">
          {[
            { color: "#1877F2", Icon: FaFacebookF, label: "Facebook" },
            { color: "#25D366", Icon: FaWhatsapp, label: "WhatsApp" },
            { color: "#000000", Icon: FaXTwitter, label: "X (Twitter)" },
            { color: "#6B7280", Icon: BiLink, label: "Copy Link" },
          ].map(({ color, Icon, label }) => (
            <div className="group relative" key={label}>
              <button
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: color }}
                aria-label={label}
              >
                <Icon className="w-4 h-4 text-white" />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderShareModal;
