  import React, { useCallback, useEffect, useRef, useState } from "react";
  import CategoryFilterBar from "./CategoryFilterBar";
  import PaginationControls from "./PaginationControls";
  import SellerCategoriesHeader from "./SellerCategoriesHeader";
  import SellerCategoryTableHeader from "./SellerCategoryTableHeader";
  import SellerCategoryTableRow from "./SellerCategoryTableRow";
  import { useSellerProduct } from "../../hooks/useSellerProduct";
  import { useAuth } from "../../../auth/contexts/AuthContext";
  import { showToast } from "../../../../common/utils/showToast";

  const SellerProductsCategoriesForm: React.FC = () => {
    const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
      null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollShadowRef = useRef<HTMLDivElement>(null);

    const { userDetails } = useAuth();
    const { listCategories } = useSellerProduct();

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
        setCategories(result || []);
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
    }, [listCategories, userDetails?.storeLinks]);

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
                          />
                        ))}
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Pagination Footer */}
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
          </div>
        </div>
      </div>
    );
  };

  export default SellerProductsCategoriesForm;
