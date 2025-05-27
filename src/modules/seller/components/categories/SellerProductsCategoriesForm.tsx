import React, { useRef, useState } from "react";
import PaginationControls from "./PaginationControls";
import SellerCategoriesHeader from "./SellerCategoriesHeader";
import SellerCategoryTableHeader from "./SellerCategoryTableHeader";
import SellerCategoryTableRow from "./SellerCategoryTableRow";
import CategoryFilterBar from "./CategoryFilterBar";
import { Navigate } from "react-router-dom";

const mockCategories = [
  {
    id: 1,
    name: "test c",
    image: "/img/category1.png",
    status: false,
    products: 1,
    subcategories: [],
  },
  {
    id: 2,
    name: "test",
    image: "/img/category2.png",
    status: true,
    products: 1,
    subcategories: [
      {
        id: 3,
        name: "sub t",
        image: "/img/category2.png",
        status: true,
        products: 1,
      },
    ],
  },
  {
    id: 3,
    name: "test 3",
    image: "/img/category2.png",
    status: true,
    products: 1,
    subcategories: [
      {
        id: 4,
        name: "sub t 3",
        image: "/img/category2.png",
        status: true,
        products: 1,
      },
    ],
  },
];

const SellerProductsCategoriesForm: React.FC = () => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);

  const paginated = mockCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(mockCategories.length / rowsPerPage);

  const toggleCategory = (id: number) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleCategoryCheckboxChange = (id: number, checked: boolean) => {
    setSelectedCategoryIds((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds(mockCategories.map((c) => c.id));
    } else {
      setSelectedCategoryIds([]);
    }
  };

    // Scroll sync logic for sticky scrollbar
  const handleBottomScroll = () => {
    if (scrollContainerRef.current && scrollShadowRef.current) {
      scrollContainerRef.current.scrollLeft = scrollShadowRef.current.scrollLeft;
    }
  };

  const handleMainScroll = () => {
    if (scrollContainerRef.current && scrollShadowRef.current) {
      scrollShadowRef.current.scrollLeft = scrollContainerRef.current.scrollLeft;
    }
  };

 

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
          <SellerCategoryTableHeader
            allSelected={selectedCategoryIds.length === mockCategories.length}
            onSelectAll={handleSelectAll}
          />

          {paginated.map((category) => (
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
              {expandedCategoryId === category.id &&
                category.subcategories?.map((sub) => (
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

          {/* Pagination Footer */}
          <div className="px-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={mockCategories.length}
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
