import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import InventoryModal from "./InventoryModal";

const InventorySection: React.FC = () => {
  const { setValue, watch, formState: { errors } } = useFormContext();

  const [isOpen, setIsOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Always-controlled values
  const rawQty = watch("stock");
  const quantity = rawQty == null ? "" : String(rawQty);   // "" when undefined/null
  const sku = (watch("sku") ?? "") as string;

  return (
    <>
      <InventoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialQuantity={quantity}
        onSave={(qty) => {
          // qty aapke modal se string aayega; form me jo chahiye waisa set karo
          // number chahiye to:
          const parsed = qty === "" ? "" : Number(qty);
          setValue("stock", parsed, { shouldDirty: true, shouldValidate: true });
        }}
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all">
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="w-full flex items-center justify-between px-6 py-5 text-left"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900">Inventory</h3>
            <p className="text-sm text-gray-500">
              Manage your stock levels seamlessly to keep up with customer demand.
            </p>
          </div>
          <div className="text-gray-700">
            {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </div>
        </button>

        {isOpen && <hr className="border-t border-gray-200" />}

        {isOpen && (
          <div className="px-6 pb-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Quantity (readOnly, opens modal) */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-800">Quantity</label>
                <input
                  type="text"
                  value={quantity}             // ✅ always string -> controlled
                  placeholder="Unlimited"
                  readOnly
                  onClick={() => setModalOpen(true)}
                  className={`w-full h-[48px] px-4 py-2 text-sm rounded-lg border cursor-pointer bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock?.message && (
                  <p className="text-xs text-red-500 mt-1">{String(errors.stock.message)}</p>
                )}
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-800">SKU ID</label>
                <input
                  type="text"
                  value={sku}                 // ✅ normalize to ""
                  onChange={(e) =>
                    setValue("sku", e.target.value, { shouldDirty: true, shouldValidate: true })
                  }
                  placeholder="Eg. 1000000001"
                  className="w-full h-[48px] px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InventorySection;
