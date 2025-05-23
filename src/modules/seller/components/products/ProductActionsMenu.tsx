// components/ProductActionsMenu.tsx
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

interface ProductActionsMenuProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ProductActionsMenu: React.FC<ProductActionsMenuProps> = ({
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
        title="More"
      >
        <MoreVertical className="w-[18px] h-[18px]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[180px] bg-white border border-gray-200 rounded-md shadow-xl text-sm z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Duplicate product
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Delete product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductActionsMenu;
