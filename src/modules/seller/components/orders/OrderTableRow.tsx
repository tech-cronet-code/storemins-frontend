// modules/seller/pages/orders/components/OrderTableRow.tsx
import React, { useState } from "react";
import { Eye, Share2 } from "lucide-react";
import OrderActionsMenu from "./OrderActionsMenu";
import OrderShareModal from "./ShareModal";
import DeleteOrderConfirmModal from "./DeleteOrderConfirmModal";

interface ProductRowProps {
  image: string;
  title: string;
  /** Small helper under title (e.g. “Qty: 5 · +1 more item”) */
  titleMeta?: string;
  /** Shown under the title block (e.g. “ODR-… · Placed on …”) */
  subtitle: string;

  /** Back-compat single category string (optional if `categories` is provided) */
  category?: string;
  /** New: all unique categories in this order (parent first, fallback to sub) */
  categories?: string[];

  price: number;
  mrp: number;
  inventory: number | string; // items count
  isActive: boolean;
  checked: boolean;
  onCheckboxChange: (checked: boolean) => void;

  /** Row click handler to open details */
  onRowClick?: () => void;

  showToggle?: boolean;
  statusLabel?: string;
  pricePrefix?: string;
  formatPrice?: (n: number) => string;
}

const ProductTableRow: React.FC<ProductRowProps> = ({
  image,
  title,
  titleMeta,
  subtitle,
  category,
  categories,
  price,
  mrp,
  inventory,
  isActive,
  checked,
  onCheckboxChange,
  onRowClick,
  showToggle = true,
  statusLabel,
  pricePrefix = "₹",
  formatPrice,
}) => {
  const [active, setActive] = useState(isActive);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const toggleStatus = () => setActive((s) => !s);
  const validatedTitle = title?.length < 3 ? "-" : title.slice(0, 200);
  const fmt = (n: number) =>
    formatPrice ? formatPrice(n) : n.toLocaleString("en-IN");

  // Build display list for category pills
  const allCats =
    categories && categories.length > 0
      ? categories
      : category && category !== "—"
      ? [category]
      : [];

  const shown = allCats.slice(0, 2);
  const remaining = allCats.slice(2);
  const moreCount = Math.max(0, allCats.length - shown.length);
  const tooltip = remaining.join(", ");

  return (
    <>
      <div
        className="w-full grid grid-cols-[40px_2.5fr_1fr_1.2fr_1fr_1fr_1fr] gap-4 px-2 py-3 border-t text-sm border-gray-200 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        onClick={onRowClick}
        onKeyDown={(e) => {
          if (!onRowClick) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRowClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={checked}
            onChange={(e) => {
              e.stopPropagation();
              onCheckboxChange(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Title + Image + Meta + Subtitle */}
        <div className="flex gap-3 items-center">
          {image?.trim() ? (
            <img
              src={image}
              alt={title}
              className="w-10 h-10 object-cover rounded border border-gray-100 shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-100 shrink-0 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              N/A
            </div>
          )}
          <div className="min-w-0">
            <p
              className="font-medium text-blue-600 text-sm whitespace-pre-wrap break-words"
              title={validatedTitle}
              onClick={(e) => e.stopPropagation()}
            >
              {validatedTitle}
            </p>
            {titleMeta ? (
              <p
                className="text-xs text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                {titleMeta}
              </p>
            ) : null}
            <p
              className="text-xs text-gray-500 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col justify-center ml-2">
          <p className="font-semibold text-black">
            {pricePrefix}
            {fmt(price)}
          </p>
          {mrp > price && (
            <p className="line-through text-gray-400 text-xs">
              {pricePrefix}
              {fmt(mrp)}
            </p>
          )}
        </div>

        {/* Category column — show up to 2 pills, then "+N more" */}
        <div
          className="flex items-center gap-1 flex-wrap"
          title={allCats.join(", ")}
          onClick={(e) => e.stopPropagation()}
        >
          {shown.length === 0 ? (
            <span className="text-gray-500">—</span>
          ) : (
            shown.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-700"
              >
                {c}
              </span>
            ))
          )}
          {moreCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs border border-blue-200 bg-blue-50 text-blue-700"
              title={tooltip}
            >
              +{moreCount} more
            </span>
          )}
        </div>

        {/* Items (quantity) */}
        <div className="flex items-center text-sm font-medium text-gray-700">
          {typeof inventory === "number" ? inventory : <i>{inventory}</i>}
        </div>

        {/* Status area */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {showToggle ? (
            <>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={active}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleStatus();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div
                  className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                    active ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    active ? "translate-x-5" : ""
                  }`}
                />
              </label>
              <span
                className={`text-sm font-medium ${
                  active ? "text-green-600" : "text-red-500"
                }`}
              >
                {active ? "Active" : "Hidden"}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {statusLabel || "—"}
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1.5 justify-end w-[100px]"
          onClick={(e) => e.stopPropagation()}
        >
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
          <OrderActionsMenu
            onEdit={() => console.log("Edit order")}
            onDuplicate={() => console.log("Duplicate order")}
            onDelete={() => setDeleteModalOpen(true)}
          />
        </div>
      </div>

      <OrderShareModal
        visible={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        type="product"
        title={title}
      />

      <DeleteOrderConfirmModal
        visible={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          console.log("Order deleted");
        }}
      />
    </>
  );
};

export default ProductTableRow;
