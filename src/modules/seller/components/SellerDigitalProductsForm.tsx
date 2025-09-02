import {
  ChevronDown,
  ChevronUp,
  FolderDown,
  Pencil,
  Plus,
  Settings,
  Upload,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useListProductsQuery } from "../../auth/services/productApi";
import BulkActionsDropdown from "./BulkActionsDropdown";
import PaginationControls from "./products/PaginationControls";
import ProductFilterBar from "./products/ProductFilterBar";
import ProductTableHeader from "./products/ProductTableHeader";
import ProductTableRow from "./products/ProductTableRow";
import ProductSettingsDrawer from "./ProductSettingsDrawer";
import UpgradeToBusinessPlanModal from "./UpgradeToBusinessPlanModal";

type SortableKey = "name" | "price" | "status";

export enum ProductType {
  PHYSICAL = "PHYSICAL",
  DIGITAL = "DIGITAL",
  MEETING = "MEETING",
  WORKSHOP = "WORKSHOP",
}

const SellerDigitalProductsForm: React.FC = () => {
  const { userDetails } = useAuth();

  const businessId = userDetails?.storeLinks?.[0]?.businessId;

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useListProductsQuery(
    { businessId: businessId || "", type: ProductType.DIGITAL },
    { skip: !businessId }
  );

  const location = useLocation();

  useEffect(() => {
    if (location.state?.refresh) {
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<SortableKey>("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);

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

  const sortedProducts = [...products].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(products.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleProductCheckboxChange = (id: string, checked: boolean) => {
    setSelectedProductIds((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const allSelected = selectedProductIds.length === products.length;

  const handleSortChange = (key: SortableKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleAddProduct = () =>
    navigate("/seller/catalogue/products/digital/create");

  if (!businessId) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Business ID not found. Please login again.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading products...</div>;
  }

  return (
    <>
      <div className="w-full min-h-screen bg-[#F9FAFB] px-3 lg:px-0 py-5 md:py-2">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h1 className="text-[20px] md:text-[24px] font-bold text-[#111827]"></h1>
            <div className="w-full md:w-auto inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="w-full sm:w-auto">
                <BulkActionsDropdown />
              </div>
              <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                <div className="flex h-[44px] rounded-md border border-[#1D4ED8] bg-[#1D4ED8] text-white overflow-hidden max-w-full sm:w-auto">
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center justify-center gap-2 px-3 md:px-5 text-sm font-semibold hover:bg-[#1E40AF] transition whitespace-nowrap w-full sm:w-auto"
                  >
                    <Plus className="w-[18px] h-[18px]" />
                    <span>Add Digital Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="px-3 border-l border-white/40 hover:bg-[#1E40AF] flex items-center"
                  >
                    {isDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[220px] z-50 bg-white border border-gray-200 rounded-md shadow-xl">
                    {[
                      {
                        label: "Bulk Import",
                        icon: <Upload className="w-4 h-4 text-blue-600" />,
                        tag: <span className="text-pink-500">💎</span>,
                        link: "/products/import",
                      },
                      {
                        label: "Bulk Update",
                        icon: <Pencil className="w-4 h-4 text-blue-600" />,
                        tag: <span className="text-purple-500">💗</span>,
                        link: "/products/bulk-update",
                      },
                      {
                        label: "Export Data",
                        icon: <FolderDown className="w-4 h-4 text-blue-600" />,
                        tag: null,
                        link: "/products/export",
                      },
                    ].map(({ label, icon, tag, link }, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate(link);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100"
                      >
                        {icon}
                        <span className="flex-1 truncate">{label}</span>
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-[44px] h-[44px] bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center"
              >
                <Settings className="w-[20px] h-[20px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-md overflow-hidden">
          <ProductFilterBar />
          <div className="relative">
            <div
              className="overflow-x-auto w-full"
              ref={scrollContainerRef}
              onScroll={handleMainScroll}
            >
              <div className="min-w-[1080px]">
                <ProductTableHeader 
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  allSelected={allSelected}
                  onSelectAll={handleSelectAll}
                />
                {paginatedProducts.length > 0 ? (
                  <>
                    {paginatedProducts.map((product) => {
                      const firstImage = product.images?.[0] || "";
                      const discountPrice = product.discountedPrice || 0;
                      const inventory = product.stock ?? "N/A";
                      const isActive = product.status === "ACTIVE";

                      const isLastItemOnPage = paginatedProducts.length === 1;

                      return (
                        <div
                          key={product.id}
                          className="hover:bg-gray-50 transition cursor-pointer"
                        >
                          <ProductTableRow
                            id={product.id}
                            image={firstImage}
                            title={product.name}
                            subtitle={product.category}
                            variant={`${product.variant?.length || 0}`}
                            price={product.price}
                            discountedPrice={
                              product.discountedPrice || product.price
                            }
                            mrp={discountPrice}
                            inventory={inventory}
                            isActive={isActive}
                            checked={selectedProductIds.includes(product.id)}
                            onCheckboxChange={(checked) =>
                              handleProductCheckboxChange(product.id, checked)
                            }
                            onEdit={(id) =>
                              navigate(
                                `/seller/catalogue/products/digital/edit/${id}`
                              )
                            }
                            isLastItemOnPage={isLastItemOnPage} // ✅ pass flag
                            onDeleteComplete={(_, shouldGoToPrevPage) => {
                              if (shouldGoToPrevPage && currentPage > 1) {
                                setCurrentPage((prev) => prev - 1);
                              }
                              refetch();
                            }}
                          />
                        </div>
                      );
                    })}

                    {/* Pagination */}
                    <div className="px-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedProducts.length}
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
                ) : (
                  <div className="text-center text-gray-400 text-sm py-12 italic">
                    No products available. Try adjusting your filters or add a
                    new product.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductSettingsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCheckoutFieldSelect={() => setShowUpgradeModal(true)}
      />

      {showUpgradeModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30">
          <UpgradeToBusinessPlanModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            onViewPlans={() => {
              setShowUpgradeModal(false);
              alert("Redirecting to business plans...");
            }}
          />
        </div>
      )}
    </>
  );
};

export default SellerDigitalProductsForm;
