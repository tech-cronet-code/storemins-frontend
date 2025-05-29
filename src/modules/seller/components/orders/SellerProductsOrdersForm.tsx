import {
  ChevronDown,
  ChevronUp,
  FolderDown,
  Pencil,
  Plus,
  Upload
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BulkActionsOrderDropdown from "./BulkActionsOrderDropdown";
import OrderFilterBar from "./OrderFilterBar";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableRow from "./OrderTableRow";
import PaginationOrdersControls from "./PaginationOrdersControls";

const mockOrders = [
  {
    id: 1,
    name: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
    category: "Test, Sub t",
    image: "/img/order.png",
    price: 10000,
    oldPrice: 20000,
    inventory: 332,
    status: true,
  },
  {
    id: 2,
    name: "Test",
    category: "Test c",
    image: "",
    price: 60,
    oldPrice: 100,
    inventory: "Unlimited",
    status: false,
  },
  {
    id: 3,
    name: "Test New",
    category: "Test Add",
    image: "",
    price: 50000,
    oldPrice: 100,
    inventory: "Unlimited",
    status: false,
  },
];

type SortableKey = "name" | "price" | "status";

const SellerProductsOrdersForm: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<SortableKey>("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);

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

  const sortedOrders = [...mockOrders].sort((a, b) => {
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

    if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      return sortOrder === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }

    return 0;
  });

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(mockOrders.map((p) => p.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleOrderCheckboxChange = (id: number, checked: boolean) => {
    setSelectedOrderIds((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const allSelected = selectedOrderIds.length === mockOrders.length;

  const handleSortChange = (key: SortableKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleAddOrder = () => navigate("/seller/catalogue/porders/create");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="w-full min-h-screen bg-[#F9FAFB] px-3 lg:px-0 py-5 md:py-2">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h1 className="text-[20px] md:text-[24px] font-bold text-[#111827]"></h1>
            <div className="w-full md:w-auto inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="w-full sm:w-auto">
                <BulkActionsOrderDropdown />
              </div>
              <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                <div className="flex h-[44px] rounded-md border border-[#1D4ED8] bg-[#1D4ED8] text-white overflow-hidden max-w-full sm:w-auto">
                  <button
                    onClick={handleAddOrder}
                    className="flex items-center justify-center gap-2 px-3 md:px-5 text-sm font-semibold hover:bg-[#1E40AF] transition whitespace-nowrap w-full sm:w-auto"
                  >
                    <Plus className="w-[18px] h-[18px]" />
                    <span>Create Order</span>
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
                        link: "/porders/import",
                      },
                      {
                        label: "Bulk Update",
                        icon: <Pencil className="w-4 h-4 text-blue-600" />,
                        tag: <span className="text-purple-500">💗</span>,
                        link: "/porders/bulk-update",
                      },
                      {
                        label: "Export Data",
                        icon: <FolderDown className="w-4 h-4 text-blue-600" />,
                        tag: null,
                        link: "/porders/export",
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
              {/* <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-[44px] h-[44px] bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center"
              >
                <Settings className="w-[20px] h-[20px]" />
              </button> */}
            </div>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-md overflow-hidden">
          <OrderFilterBar />
          <div className="relative">
            <div
              className="overflow-x-auto w-full"
              ref={scrollContainerRef}
              onScroll={handleMainScroll}
            >
              <div className="min-w-[1080px]">
                <OrderTableHeader
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  allSelected={allSelected}
                  onSelectAll={handleSelectAll}
                />
                {paginatedOrders.length > 0 ? (
                  <>
                    {paginatedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        <OrderTableRow
                          image={order.image}
                          title={order.name}
                          subtitle={order.category}
                          price={order.price}
                          mrp={order.oldPrice}
                          inventory={order.inventory}
                          isActive={order.status}
                          checked={selectedOrderIds.includes(order.id)}
                          onCheckboxChange={(checked) =>
                            handleOrderCheckboxChange(order.id, checked)
                          }
                        />
                      </div>
                    ))}

                    {/* Pagination aligned properly with padding fix */}
                    <div className="px-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                      <PaginationOrdersControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedOrders.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(val) => {
                          setRowsPerPage(val);
                          setCurrentPage(1);
                        }}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-6">
                    No porders available on this page.
                  </div>
                )}
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
            <div className="sticky bottom-0 left-0 right-0 h-5 overflow-x-auto pointer-events-none">
              <div className="min-w-[1080px] h-1 bg-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* <OrderSettingsDrawer
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
      )} */}
    </>
  );
};

export default SellerProductsOrdersForm;
