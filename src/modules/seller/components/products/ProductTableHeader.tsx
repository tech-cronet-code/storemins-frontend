import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductTableHeaderProps {
  sortKey: string;
  sortOrder: "asc" | "desc";
  onSortChange: (key: "name" | "price" | "status") => void;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
  sortKey,
  sortOrder,
  onSortChange,
  allSelected,
  onSelectAll,
}) => {
  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronDown className="w-4 h-4 opacity-40" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="w-full grid grid-cols-[40px_2.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-2 py-3 border-b bg-gray-50 text-sm font-medium text-gray-600 border-gray-200">
      {/* Checkbox Column */}
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      </div>

      {/* Product */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSortChange("name")}
          className="flex items-center gap-1 hover:text-black"
        >
          Product {renderSortIcon("name")}
        </button>
      </div>

      {/* Price */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onSortChange("price")}
          className="flex items-center gap-1 hover:text-black"
        >
          Price {renderSortIcon("price")}
        </button>
      </div>

      {/* Category */}
      <div className="flex items-center">Category</div>

      {/* Inventory */}
      <div className="flex items-center">Inventory</div>

      {/* Status */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSortChange("status")}
          className="flex items-center gap-1 hover:text-black"
        >
          Status {renderSortIcon("status")}
        </button>
      </div>

      {/* Action */}
      <div className="flex items-center justify-end text-right w-[60px]">
        Action
      </div>
    </div>
  );
};

export default ProductTableHeader;
