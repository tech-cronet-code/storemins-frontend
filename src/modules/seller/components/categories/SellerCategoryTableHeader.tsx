import React from "react";

interface Props {
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

const SellerCategoryTableHeader: React.FC<Props> = ({ allSelected, onSelectAll }) => {
  return (
  <div className="w-full grid grid-cols-[40px_2.5fr_1fr_1.2fr_1.2fr] gap-2 px-4 py-3 border-b bg-gray-50 text-sm font-medium text-gray-600 border-gray-200">
  <div className="flex items-center justify-center">
    <input
      type="checkbox"
      className="w-4 h-4"
      checked={allSelected}
      onChange={(e) => onSelectAll(e.target.checked)}
    />
  </div>
  <div className="flex items-center">Category</div>
  <div className="flex items-center justify-center">Products</div>
  <div className="flex items-center justify-center">Status</div>
  <div className="flex items-center justify-end pr-6">Action</div>
</div>

  );
};

export default SellerCategoryTableHeader;
