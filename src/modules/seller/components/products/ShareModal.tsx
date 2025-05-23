import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
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
        className="bg-white rounded-md px-6 py-5 shadow-xl relative w-full max-w-[320px]"
      >
        {/* Header */}
        <h2 className="text-lg font-semibold text-center">Share Product</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="group relative">
            <button className="bg-[#1877F2] text-white w-10 h-10 rounded flex items-center justify-center">
              <i className="fab fa-facebook-f text-[14px]" />
            </button>
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
              Facebook
            </span>
          </div>

          <div className="group relative">
            <button className="bg-[#25D366] text-white w-10 h-10 rounded flex items-center justify-center">
              <i className="fab fa-whatsapp text-[16px]" />
            </button>
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
              WhatsApp
            </span>
          </div>

          <div className="group relative">
            <button className="bg-black text-white w-10 h-10 rounded flex items-center justify-center">
              <i className="fab fa-x-twitter text-[14px]" />
            </button>
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
              X (Twitter)
            </span>
          </div>

          <div className="group relative">
            <button className="bg-[#6B7280] text-white w-10 h-10 rounded flex items-center justify-center">
              <i className="fas fa-link text-[14px]" />
            </button>
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
              Copy Link
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
