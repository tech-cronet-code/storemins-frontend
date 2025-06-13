import React, { useState } from "react";
import { Eye, Share2 } from "lucide-react";
import ShareModal from "./ShareModal";
import ProductActionsMenu from "./ProductActionsMenu";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "../../../auth/services/productApi";
import { showToast } from "../../../../common/utils/showToast";
import { useAuth } from "../../../auth/contexts/AuthContext";

interface ProductRowProps {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  variant: string;
  price: number;
  discountedPrice: number;
  mrp: number;
  inventory: number | string;
  isActive: boolean;
  checked: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onEdit: (id: string) => void;
  onDeleteComplete?: (
    deletedId: string,
    shouldGoToPreviousPage?: boolean
  ) => void;
  isLastItemOnPage?: boolean; // ✅ Add this prop to decide pagination logic
}

const ProductTableRow: React.FC<ProductRowProps> = ({
  id,
  image,
  title,
  subtitle,
  variant,
  price,
  discountedPrice,
  // mrp,
  inventory,
  isActive,
  checked,
  onCheckboxChange,
  onEdit,
  onDeleteComplete,
  isLastItemOnPage = false, // default to false
}) => {
  const { userDetails } = useAuth();

  const businessId = userDetails?.storeLinks?.[0]?.businessId;
  const [active, setActive] = useState(isActive);
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const toggleStatus = async () => {
    if (!businessId) {
      showToast({
        type: "error",
        message: "Business ID not found",
        showClose: true,
      });
      return;
    }

    const newStatus = active ? "INACTIVE" : "ACTIVE";
    setActive(!active);

    try {
      await updateProductStatus({ id, status: newStatus, businessId }).unwrap();
      showToast({
        type: "success",
        message: `Product marked as ${newStatus}`,
        showClose: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log(err, "err");

      setActive(active); // revert on failure
      showToast({
        type: "error",
        message: "Failed to update product status",
        showClose: true,
      });
    }
  };

  const validatedTitle = title.length < 3 ? "-" : title.slice(0, 200);

  const handleDelete = async () => {
    try {
      const res = await deleteProduct({ id }).unwrap();
      showToast({
        type: "success",
        message: res.message || "Product deleted successfully",
        showClose: true,
      });

      setIsVisible(false);

      setTimeout(() => {
        setDeleteModalOpen(false);
        onDeleteComplete?.(id, isLastItemOnPage); // ✅ notify with page info
      }, 300);
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to delete product",
        showClose: true,
      });
      console.error("❌ Delete error:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="w-full grid grid-cols-[40px_2.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-2 py-3 border-t text-sm border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-opacity duration-300 ease-in-out"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={checked}
            onChange={(e) => onCheckboxChange(e.target.checked)}
          />
        </div>

        {/* Product Title + Image */}
        <div className="flex gap-3 items-center">
          {image?.trim() ? (
            <img
              src={image}
              alt={title}
              className="w-10 h-10 object-cover rounded border border-gray-100 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-100 shrink-0 text-xs">
              N/A
            </div>
          )}
          <div className="min-w-0">
            <p
              className="font-medium text-blue-600 cursor-pointer text-sm whitespace-pre-wrap break-words"
              title={validatedTitle}
            >
              {validatedTitle}
            </p>
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col justify-center ml-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-black">
              ₹{discountedPrice.toLocaleString()}
            </p>

            {/* Discount Badge */}
            {price > discountedPrice && (
              <span className="text-[11px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded">
                {Math.round(((price - discountedPrice) / price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Original Price */}
          {price > discountedPrice && (
            <p className="line-through text-gray-400 text-xs mt-0.5">
              ₹{price.toLocaleString()}
            </p>
          )}
        </div>

        {/* variant */}
        <div className="flex items-center text-sm text-gray-600">{variant}</div>

        {/* Inventory */}
        <div className="flex items-center text-sm font-medium text-gray-700">
          {typeof inventory === "number" ? inventory : <i>{inventory}</i>}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={active}
              onChange={toggleStatus}
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                active ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                active ? "translate-x-5" : ""
              }`}
            ></div>
          </label>
          <span
            className={`text-sm font-medium ${
              active ? "text-green-600" : "text-red-500"
            }`}
          >
            {active ? "Active" : "Hidden"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 justify-end w-[100px]">
          <button
            onClick={() => {}}
            title="Preview"
            className="group w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
          >
            <Eye className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setShareModalOpen(true)}
            title="Share"
            className="group w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
          <ProductActionsMenu
            onEdit={() => onEdit(id)}
            onDuplicate={() => console.log("Duplicate product")}
            onDelete={() => setDeleteModalOpen(true)}
          />
        </div>
      </div>

      <ShareModal
        visible={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        type="product"
        title={title}
      />

      <DeleteConfirmModal
        visible={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />
    </>
  );
};

export default ProductTableRow;
