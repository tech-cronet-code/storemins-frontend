import {
  ArrowLeft,
  GripVertical,
  HelpCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import AddFieldForm from "../products/AddFieldForm";
import ToggleSwitch from "../ToggleSwitch";
import ConfirmationModal from "../products/ConfirmationModal";

// FIELD LIST
const fields = [
  {
    label: "Purchase Price",
    description: "Goods purchase price (visible to you only)",
  },
  {
    label: "Summary",
    description: "2-3 Highlight points e.g., 4 Star Frost Free Refrigerator.",
  },
  { label: "Description", description: "Product detailed information" },
  { label: "Brand", description: "Product brand information" },
  {
    label: "Barcode",
    description: "ISBN, UPC or other unique code (visible to you only)",
  },
  { label: "HSN", description: "6 digit code, helpful in GST bills" },
  {
    label: "Min Quantity",
    description: "Minimum quantity to be sold per order",
  },
  {
    label: "Max Quantity",
    description: "Maximum quantity to be sold per order",
  },
  {
    label: "Product ID",
    description: "Helpful in identifying the product (visible to you only)",
  },
  {
    label: "Shipping Weight",
    description: "Helpful for weight based shipping",
  },
  { label: "Dimension", description: "Helpful for dimension based shipping" },
];

// ✅ REUSABLE ATTRIBUTE CARD
interface ProductAttributeCardProps {
  name: string;
  description: string;
  categories: string[];
  onDelete: (name: string) => void;
}

const ProductAttributeCard = ({
  name,
  description,
  categories,
  onDelete,
}: ProductAttributeCardProps) => (
  <div className="border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm">
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 mt-1 text-gray-400" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Pencil className="w-4 h-4 text-blue-600 cursor-pointer hover:scale-110 transition" />
        <Trash2
          className="w-4 h-4 text-red-600 cursor-pointer hover:scale-110 transition"
          onClick={() => onDelete(name)}
        />
      </div>
    </div>
    <div className="my-2 border-t border-gray-100" />
    <div className="flex flex-wrap gap-2">
      {categories.map((cat, index) => (
        <span
          key={index}
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            cat === "All Categories"
              ? "bg-blue-50 text-blue-900"
              : "bg-red-50 text-red-600"
          }`}
        >
          {cat}
        </span>
      ))}
    </div>
  </div>
);

interface ProductSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckoutFieldSelect: () => void;
}

// ✅ MAIN COMPONENT
const OrderSettingsDrawer = ({
  open,
  onClose,
  onCheckoutFieldSelect,
}: ProductSettingsDrawerProps) => {
  const [toggles, setToggles] = useState<boolean[]>(
    Array(fields.length).fill(false)
  );
  const [showAddFieldForm, setShowAddFieldForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");

  const handleDeleteClick = (name: string) => {
    setSelectedItemName(name);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItemName);
    setShowConfirmDelete(false);
  };

  const drawer = (
    <div
      className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-300 ease-in-out ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`relative h-full w-full sm:w-[520px] md:w-[560px] lg:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {showAddFieldForm && (
                <button onClick={() => setShowAddFieldForm(false)}>
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-lg font-bold text-gray-900">
                {showAddFieldForm ? "Add Field" : "Product Fields"}
              </h2>
            </div>
            {showAddFieldForm ? (
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" /> Help
              </a>
            ) : (
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-thin">
            {showAddFieldForm ? (
              <AddFieldForm
                onSave={() => setShowAddFieldForm(false)}
                onCancel={() => setShowAddFieldForm(false)}
                onCheckoutFieldSelect={onCheckoutFieldSelect}
              />
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  These are the optional fields which are available for you. You
                  can also add more fields as per your product needs.
                </p>

                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-4">
                  Additional Product Fields
                </h3>

                <div className="space-y-4">
                  {fields.map((field, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {field.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {field.description}
                          </p>
                        </div>
                        <ToggleSwitch
                          enabled={toggles[idx]}
                          onChange={(val) =>
                            setToggles((prev) =>
                              prev.map((v, i) => (i === idx ? val : v))
                            )
                          }
                        />
                      </div>
                      {idx < fields.length - 1 && (
                        <div className="border-t border-gray-100 mt-3" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Attribute Fields */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h3 className="text-xs font-semibold text-[#111827] uppercase mb-4">
                    Product Attribute Fields
                  </h3>

                  <ProductAttributeCard
                    name="Color"
                    description="Color"
                    categories={["All Categories"]}
                    onDelete={handleDeleteClick}
                  />
                  <ProductAttributeCard
                    name="Material"
                    description="Fabric or construction type"
                    categories={["Home Essentials", "Women's Wear"]}
                    onDelete={handleDeleteClick}
                  />

                  <div className="mt-6 flex items-center justify-between">
                    <a
                      href="#"
                      className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      📘 Check out Help Video
                    </a>
                    <button
                      onClick={() => setShowAddFieldForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1"
                    >
                      Add New Field{" "}
                      <span className="text-base leading-none">＋</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        message={`Do you really want to delete <strong>${selectedItemName}</strong>?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );

  return createPortal(drawer, document.body);
};

export default OrderSettingsDrawer;
