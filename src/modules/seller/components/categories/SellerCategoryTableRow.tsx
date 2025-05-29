import React, { useEffect, useRef, useState } from "react";
import { Eye, Pencil, Share2, MoreVertical, Plus, Minus, X } from "lucide-react";
import classNames from "classnames";
import ShareModal from "../products/ShareModal";

interface Category {
  id: number;
  name: string;
  image: string;
  status: boolean;
  products: number;
  subcategories?: Category[];
}

interface Props {
  category: Category;
  isSub?: boolean;
  expanded?: boolean;
  checked: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onToggleExpand?: () => void;
}

const SellerCategoryTableRow: React.FC<Props> = ({
  category,
  isSub = false,
  expanded,
  checked,
  onCheckboxChange,
  onToggleExpand,
}) => {
  const [active, setActive] = useState(category.status);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const hasSubcategories = (category.subcategories?.length ?? 0) > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOutsideDeleteModal = (e: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setDeleteModalOpen(false);
        setConfirmDelete(false);
      }
    };
    if (isDeleteModalOpen) {
      document.addEventListener("mousedown", handleOutsideDeleteModal);
    }
    return () => document.removeEventListener("mousedown", handleOutsideDeleteModal);
  }, [isDeleteModalOpen]);

  const toggleStatus = () => setActive((prev) => !prev);

  return (
    <>
      <div
        className={classNames(
          "w-full grid grid-cols-[40px_2.5fr_1fr_1.2fr_1.2fr] gap-2 px-4 py-3 border-t text-sm border-gray-200 text-gray-700 bg-white hover:bg-gray-50",
          isSub && "pl-10"
        )}
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

        {/* Category Name */}
        <div
          className={classNames("flex items-center gap-2", !isSub && hasSubcategories && "cursor-pointer")}
          onClick={
            !isSub && hasSubcategories && onToggleExpand
              ? () => onToggleExpand()
              : undefined
          }
        >
          {!isSub && hasSubcategories && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
            >
              {expanded ? <Minus className="w-4 h-4 text-gray-600" /> : <Plus className="w-4 h-4 text-gray-600" />}
            </button>
          )}
          <img
            src={category.image}
            alt={category.name}
            className="w-10 h-10 object-cover rounded border border-gray-200"
          />
          <span className="text-blue-600 font-medium">{category.name}</span>
        </div>

        {/* Product Count */}
        <div className="flex items-center justify-center">{category.products}</div>

        {/* Status Toggle */}
        <div className="flex items-center justify-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={active}
              onChange={toggleStatus}
            />
            <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${active ? "bg-blue-600" : "bg-gray-300"}`} />
            <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${active ? "translate-x-5" : ""}`} />
          </label>
          <span className={`text-sm font-medium ${active ? "text-green-600" : "text-red-500"}`}>
            {active ? "Active" : "Hidden"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 justify-end">
          <button className="group w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition">
            <Pencil className="w-[18px] h-[18px]" />
          </button>
          <button className="group w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition">
            <Eye className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setShareModalOpen(true)}
            title="Share"
            className="group w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="group w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
            >
              <MoreVertical className="w-[18px] h-[18px]" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50 text-sm">
                {!isSub && (
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
                    onClick={() => {
                      setIsMenuOpen(false);
                      alert("Add subcategory clicked");
                    }}
                  >
                    Add subcategory
                  </button>
                )}
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        visible={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        type="category"
        title={category.name}
        message={isSub ? "Share Sub Category" : "Share Category"}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-md px-6 py-5 shadow-xl relative w-full max-w-md"
          >
            <h2 className="text-lg font-semibold">Confirm deletion</h2>
            <p className="text-sm text-gray-600 mt-2">
              Deleting this category will also delete all subcategories and products under it.
            </p>

            <label className="flex items-center mt-4 gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                I understand I cannot undo this action.
              </span>
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="text-sm px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setConfirmDelete(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`text-sm px-4 py-2 rounded text-white ${
                  confirmDelete
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
                disabled={!confirmDelete}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setConfirmDelete(false);
                  alert("Category deleted");
                }}
              >
                Yes, delete
              </button>
            </div>

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => {
                setDeleteModalOpen(false);
                setConfirmDelete(false);
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerCategoryTableRow;
