import React, { useCallback, useEffect, useRef, useState } from "react";
import { showToast } from "../../../../common/utils/showToast";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";
import { useSellerProduct } from "../../hooks/useSellerProduct";
import { Category } from "../../types/category";
import CategoryFilterBar from "./CategoryFilterBar";
import PaginationControls from "./PaginationControls";
import SellerCategoriesHeader from "./SellerCategoriesHeader";
import SellerCategoryTableHeader from "./SellerCategoryTableHeader";
import SellerCategoryTableRow from "./SellerCategoryTableRow";
import { useNavigate } from "react-router-dom";

const SellerProductsCategoriesForm: React.FC = () => {
  const navigate = useNavigate();

  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);

  const handleEditCategory = (category: Category, isSub: boolean) => {
    navigate(
      `/seller/catalogue/categories/edit/${category.id}?type=${
        isSub ? "SUB" : "PARENT"
      }`
    );
  };
  // const [isEditModalOpen, setEditModalOpen] = useState(false);

  const { userDetails } = useSellerAuth();
  const { listCategories, deleteCategories } = useSellerProduct();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    const businessId = userDetails?.storeLinks?.[0]?.businessId;
    if (!businessId) {
      showToast({
        type: "error",
        message: "Business ID not found!",
        showClose: true,
      });
      return;
    }

    try {
      setLoading(true);
      const result = await listCategories({ businessId }).unwrap();
      const data = result || [];
      setCategories(data);

      //  Reset to page 1 if no items
      if (data.length === 0) {
        setCurrentPage(1);
      } else {
        const maxPage = Math.max(1, Math.ceil(data.length / rowsPerPage));
        if (currentPage > maxPage) {
          setCurrentPage(maxPage);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showToast({
        type: "error",
        message: "Failed to fetch categories.",
        showClose: true,
      });
    } finally {
      setLoading(false);
    }
  }, [listCategories, rowsPerPage, userDetails?.storeLinks, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleCategoryCheckboxChange = (id: string, checked: boolean) => {
    setSelectedCategoryIds((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = categories.flatMap((c) => [
        c.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(c.subCategories?.map((sub: any) => sub.id) || []),
      ]);
      setSelectedCategoryIds(allIds);
    } else {
      setSelectedCategoryIds([]);
    }
  };

  const handleBottomScroll = () => {
    if (scrollContainerRef.current && scrollShadowRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollShadowRef.current.scrollLeft;
    }
  };

  const handleMainScroll = () => {
    if (scrollContainerRef.current && scrollShadowRef.current) {
      scrollShadowRef.current.scrollLeft =
        scrollContainerRef.current.scrollLeft;
    }
  };

  const paginatedCategories = categories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(categories.length / rowsPerPage);

  return (
    <>
      {selectedCategoryIds.length > 0 && (
        <div className="mb-4">
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                "Are you sure you want to delete the selected categories?"
              );
              if (confirmed) {
                const success = await deleteCategories.deleteCategories(
                  selectedCategoryIds
                );
                if (success) {
                  setSelectedCategoryIds([]);
                  fetchCategories();
                }
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete Selected ({selectedCategoryIds.length})
          </button>
        </div>
      )}
      <div className="w-full min-h-screen bg-[#F9FAFB] py-6">
        <div className="mx-auto" style={{ maxWidth: "100%" }}>
          <SellerCategoriesHeader />
          <CategoryFilterBar />

          {/* Scrollable Table Wrapper */}
          <div
            className="w-full overflow-x-auto"
            ref={scrollContainerRef}
            onScroll={handleMainScroll}
          >
            <div className="min-w-[800px] bg-white border border-gray-200 rounded-md relative">
              {/* Table Header */}
              <SellerCategoryTableHeader
                allSelected={
                  selectedCategoryIds.length ===
                  categories.flatMap((c) => [
                    c.id,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(c.subCategories?.map((s: any) => s.id) || []),
                  ]).length
                }
                onSelectAll={handleSelectAll}
              />

              {/* Loading */}
              {loading ? (
                <div className="text-center py-6 text-gray-500">Loading...</div>
              ) : (
                <>
                  {/* ✅ PLACE THIS RIGHT HERE */}
                  {!loading && paginatedCategories.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm italic">
                      No categories found. Try adjusting your filters or add a
                      new category.
                    </div>
                  )}
                  {/* Table Rows */}
                  {paginatedCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      <SellerCategoryTableRow
                        category={category}
                        checked={selectedCategoryIds.includes(category.id)}
                        onCheckboxChange={(checked) =>
                          handleCategoryCheckboxChange(category.id, checked)
                        }
                        onToggleExpand={() => toggleCategory(category.id)}
                        expanded={expandedCategoryId === category.id}
                        onEdit={(cat) => handleEditCategory(cat, false)} // 👈 PARENT for parent // ✅ pass edit handler
                        onRefresh={fetchCategories}
                      />
                      {/* ✅ Subcategories jab expand hoga tab */}
                      {expandedCategoryId === category.id &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        category.subCategories?.map((sub: any) => (
                          <SellerCategoryTableRow
                            key={sub.id}
                            category={sub}
                            isSub
                            checked={selectedCategoryIds.includes(sub.id)}
                            onCheckboxChange={(checked) =>
                              handleCategoryCheckboxChange(sub.id, checked)
                            }
                            onEdit={(cat) => handleEditCategory(cat, true)} // 👈 SUB for sub
                            // ✅ pass edit handler
                            onRefresh={fetchCategories}
                          />
                        ))}
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Pagination Footer */}

              {/* Pagination Footer */}
              {paginatedCategories.length > 0 && (
                <>
                  <div className="px-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={categories.length}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(val) => {
                        setRowsPerPage(val);
                        setCurrentPage(1);
                      }}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>

                  {/* Sticky Bottom Scrollbar */}
                  <div className="sticky bottom-0 left-0 z-10 border-t border-gray-100">
                    <div
                      ref={scrollShadowRef}
                      className="overflow-x-auto w-full h-[20px] scrollbar-thin pointer-events-auto"
                      onScroll={handleBottomScroll}
                      style={{
                        scrollbarColor: "#d1d5db #fff",
                        scrollbarWidth: "thin",
                      }}
                    >
                      <div className="min-w-[1080px] h-[20px]" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerProductsCategoriesForm;
