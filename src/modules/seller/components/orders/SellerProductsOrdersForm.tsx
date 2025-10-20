// modules/seller/pages/orders/SellerProductsOrdersForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDown,
  ChevronUp,
  FolderDown,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import OrderFilterBar from "./OrderFilterBar";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableRow from "./OrderTableRow";
import PaginationOrdersControls from "./PaginationOrdersControls";
import {
  MyOrdersItem,
  useGetMyOrdersQuery,
} from "../../../customer/services/customerOrderApi";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";
import BulkActionsOrderDropdown from "./BulkActionsOrderDropdown";

/* -------------------------- helpers -------------------------- */

type SortableKey = "name" | "price" | "status";

function formatPlacedDate(iso?: string | null) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const day = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return day.replace(/ /g, " ");
  } catch {
    return "";
  }
}

/** Resolve businessId from URL → localStorage → AuthContext. */
function useResolvedBusinessId() {
  const { userDetails } = useSellerAuth() as any;

  const businessId = useMemo(() => {
    // 1) URL (?businessId=...)
    const search = typeof window !== "undefined" ? window.location.search : "";
    const fromQuery = new URLSearchParams(search).get("businessId");
    if (fromQuery && fromQuery.trim()) return fromQuery.trim();

    // 2) localStorage
    try {
      const fromLS = window.localStorage.getItem("activeBusinessId");
      if (fromLS && fromLS.trim()) return fromLS.trim();
    } catch {
      /* empty */
    }

    // 3) AuthContext (first store link)
    const id =
      userDetails?.storeLinks?.[0]?.businessId?.trim?.() ||
      userDetails?.storeLinks?.[0]?.businessId ||
      "";

    return id || "";
  }, [userDetails]);

  // persist to localStorage for future navigations
  useEffect(() => {
    if (!businessId) return;
    try {
      window.localStorage.setItem("activeBusinessId", businessId);
    } catch {
      /* empty */
    }
  }, [businessId]);

  return businessId;
}

/* ----------------------- main component ---------------------- */

const SellerProductsOrdersForm: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<SortableKey>("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);

  // ✅ dynamically resolved businessId
  const businessId = useResolvedBusinessId();

  /** ===== API: fetch ongoing orders (skip until businessId exists) ===== */
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyOrdersQuery(
      {
        businessId,
        status: "ONGOING",
        page: currentPage,
        limit: rowsPerPage,
      },
      { skip: !businessId }
    );

  /** Map API items to the shape expected by the row component */
  const apiRows = useMemo(() => {
    const items = (data?.items ?? []) as MyOrdersItem[];

    return items.map((o) => {
      const orderItems = o.OrderItem ?? [];
      const first = orderItems[0];

      const productName = first?.Product?.name || "—";
      const firstQty = Number(first?.quantity || 0);
      const distinctCount = orderItems.length;
      const moreCount = Math.max(0, distinctCount - 1);
      const totalQty =
        orderItems.reduce((sum, it) => sum + Number(it.quantity || 0), 0) || 0;

      // “Qty: X · +N more item(s)”
      const titleMeta =
        "Qty: " +
        firstQty +
        (moreCount > 0
          ? ` · +${moreCount} more item${moreCount > 1 ? "s" : ""}`
          : "");

      // collect unique categories across all order items (prefer parent, fallback sub)
      const catSet = new Set<string>();
      for (const it of orderItems as any[]) {
        const parent = it?.Product?.categoryParentName as string | undefined;
        const sub = it?.Product?.categorySubName as string | undefined;
        const chosen = parent ?? sub;
        if (chosen && chosen.trim()) catSet.add(chosen.trim());
      }
      const categories = Array.from(catSet);
      const primaryCategory = categories[0] ?? "—";

      const isPending =
        (o.OrderTrackingStatus?.currentStep || o.status || "") === "PENDING";

      const placedStr = formatPlacedDate(o.placedAt);
      const subtitle = placedStr
        ? `${o.orderNumber} · Placed on ${placedStr}`
        : o.orderNumber;

      return {
        id: o.id,
        image: "",
        name: productName,
        nameMeta: titleMeta,
        subtitle,
        category: primaryCategory,
        categories,
        price: Number(o.totalAmount || 0),
        oldPrice: Number(o.totalAmount || 0),
        inventory: totalQty,
        status: isPending,
        placedAt: o.placedAt,
      };
    });
  }, [data]);

  /** Client-side sort for current page */
  const sortedOrders = useMemo(() => {
    const rows = [...apiRows] as any[];
    rows.sort((a, b) => {
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
    return rows;
  }, [apiRows, sortKey, sortOrder]);

  /** Pagination: API already pages; we pass controls through */
  const paginatedOrders = sortedOrders;
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  /** Selection */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(paginatedOrders.map((p: any) => p.id));
    } else {
      setSelectedOrderIds([]);
    }
  };
  const handleOrderCheckboxChange = (id: string, checked: boolean) => {
    setSelectedOrderIds((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };
  const allSelected =
    paginatedOrders.length > 0 &&
    selectedOrderIds.length === paginatedOrders.length;

  /** Sorting */
  const handleSortChange = (key: SortableKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  /** Scroll sync */
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

  const handleAddOrder = () => navigate("/seller/catalogue/porders/create");

  /** Close dropdown on outside click */
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
                    className="flex items-center justify-center gap-2 px-3 md:px-5 text-sm font-semibold hover:bg-[#1E40AF] transition whitespace-nowrap w/full sm:w-auto"
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
                  inventoryLabel="Items"
                />

                {!businessId ? (
                  <div className="text-center text-gray-500 text-sm py-10">
                    Select a store to view orders (no business selected).
                  </div>
                ) : isLoading || isFetching ? (
                  <div className="text-center text-gray-500 text-sm py-6">
                    Loading orders…
                  </div>
                ) : isError ? (
                  <div className="text-center text-red-600 text-sm py-6">
                    Failed to load orders{" "}
                    {String(
                      (error as any)?.data?.message ||
                        (error as any)?.error ||
                        ""
                    )}
                  </div>
                ) : paginatedOrders.length > 0 ? (
                  <>
                    {paginatedOrders.map((order: any) => (
                      <OrderTableRow
                        key={order.id}
                        image={order.image}
                        title={order.name}
                        titleMeta={order.nameMeta}
                        subtitle={order.subtitle}
                        category={order.category}
                        categories={order.categories}
                        price={order.price}
                        mrp={order.oldPrice}
                        inventory={order.inventory}
                        isActive={order.status}
                        checked={selectedOrderIds.includes(order.id)}
                        onCheckboxChange={(checked) =>
                          handleOrderCheckboxChange(order.id, checked)
                        }
                        // 🔗 navigate to details with businessId
                        onRowClick={() =>
                          navigate(
                            `/seller/orders/${
                              order.id
                            }?businessId=${encodeURIComponent(businessId)}`
                          )
                        }
                      />
                    ))}

                    <div className="px-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                      <PaginationOrdersControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(val) => {
                          setRowsPerPage(val);
                          setCurrentPage(1);
                          refetch();
                        }}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-6">
                    No orders available on this page.
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
    </>
  );
};

export default SellerProductsOrdersForm;
