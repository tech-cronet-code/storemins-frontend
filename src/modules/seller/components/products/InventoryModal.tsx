import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (qty: string) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
    >
      <div className="bg-white w-[560px] rounded-md shadow-md border border-gray-200 p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-semibold text-gray-900">Inventory</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Table-like layout without full border */}
        <div>
          {/* Table header */}
          <div className="grid grid-cols-2 bg-gray-100 px-4 py-[10px] text-[15px] font-medium text-gray-700 rounded-t">
            <span>Warehouse name</span>
            <span>Quantity</span>
          </div>

          {/* Row */}
          <div className="grid grid-cols-2 px-4 py-[14px] items-center text-sm">
            <span className="text-gray-900 text-[15px]">Tettt</span>
            <input
              type="text"
              placeholder="Eg. 99"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              onSave(quantity || "Unlimited");
              onClose();
            }}
            className="bg-[#0B5ED7] hover:bg-[#0A53BE] text-white text-[15px] font-semibold py-[9px] px-6 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
