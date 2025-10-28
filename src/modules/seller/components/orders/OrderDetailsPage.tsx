// modules/seller/pages/orders/OrderDetailsPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  ReceiptText,
  Truck,
  PackageCheck,
  Clock,
  MapPin,
  User2,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import DeliveryTimeModal from "./DeliveryTimeModal";
import {
  useGetOrderDetailQuery,
  useTrackOrderQuery,
  useGetInvoiceQuery,
  useCancelOrderMutation, // <-- cancel API
} from "../../../customer/services/customerOrderApi";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";

/* ---------------- helpers ---------------- */
const currencyINR = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

function useResolvedBusinessId() {
  const { userDetails } = useSellerAuth() as any;
  const [sp] = useSearchParams();
  const fromQuery = sp.get("businessId");
  if (fromQuery && fromQuery.trim()) return fromQuery.trim();

  try {
    const fromLS = window.localStorage.getItem("activeBusinessId");
    if (fromLS && fromLS.trim()) return fromLS.trim();
  } catch {
    /* ignore */
  }

  const id =
    userDetails?.storeLinks?.[0]?.businessId?.trim?.() ||
    userDetails?.storeLinks?.[0]?.businessId ||
    "";
  return id || "";
}

const statusColor: Record<
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED",
  string
> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-200",
  PROCESSING: "bg-sky-50 text-sky-700 ring-sky-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  RETURNED: "bg-zinc-50 text-zinc-700 ring-zinc-200",
};

const Step = ({
  active,
  title,
  subtitle,
}: {
  active?: boolean;
  title: string;
  subtitle?: string;
}) => (
  <div className="relative pl-6">
    <div
      className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${
        active ? "bg-blue-600" : "bg-gray-300"
      }`}
    />
    <div className="text-[14px] sm:text-[15px] font-medium text-slate-900">
      {title}
    </div>
    {subtitle ? (
      <div className="text-[12px] text-slate-500">{subtitle}</div>
    ) : null}
  </div>
);

/* ---------------- tiny modal component ---------------- */
function CancelConfirmModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="cancel-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative mx-3 w-full max-w-md rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 id="cancel-title" className="text-[16px] font-semibold">
            Cancel Order
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-3 text-[14px] text-slate-700">
          Once you cancel the order, you can’t ship it anymore.
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm px-4 py-2"
          >
            {loading ? "Cancelling…" : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */
const OrderDetailsPage: React.FC = () => {
  const { orderId = "" } = useParams<{ orderId: string }>();
  const businessId = useResolvedBusinessId();
  const navigate = useNavigate();

  // Real data
  const { data, isLoading, isFetching, isError, refetch } =
    useGetOrderDetailQuery(
      { businessId, orderId },
      { skip: !businessId || !orderId }
    );
  const { data: track } = useTrackOrderQuery(
    { businessId, orderId },
    { skip: !businessId || !orderId }
  );
  const { data: invoice } = useGetInvoiceQuery(
    { businessId, orderId },
    { skip: !businessId || !orderId }
  );

  // cancel
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const itemsTotal = useMemo(
    () =>
      (data?.OrderItem || []).reduce(
        (n, it) => n + Number(it.totalPrice ?? it.unitPrice * it.quantity),
        0
      ),
    [data]
  );

  // For now we only display tracking; advancing status would need seller endpoint.
  const canAdvance = false;

  /* ---------------- loading / error ---------------- */
  if (isLoading || isFetching) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="h-9 w-56 bg-slate-200 animate-pulse rounded mb-4" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="h-48 bg-slate-100 animate-pulse rounded" />
          <div className="h-48 bg-slate-100 animate-pulse rounded" />
          <div className="h-48 bg-slate-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="mt-6 text-red-600">Failed to load order.</div>
      </div>
    );
  }

  /* ---------------- computed ---------------- */
  const placedStr = (data as any).placedAt
    ? new Date((data as any).placedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const badge =
    statusColor[(data.status as keyof typeof statusColor) || "PENDING"] ||
    statusColor.PENDING;

  /* ---------------- handlers ---------------- */
  const handleConfirmCancel = async () => {
    try {
      await cancelOrder({
        businessId,
        orderId: data.id,
        reason: "Cancelled by seller",
      }).unwrap();
      setShowCancelModal(false);
      // Optional: show toast here if you have a toaster
      // Refresh the page data (or navigate back to list)
      await refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Optional: toast error
      setShowCancelModal(false);
    }
  };

  /* ---------------- ui ---------------- */
  return (
    <div className="min-h-[100dvh] bg-[#f7f8fa]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-2 sm:px-3 md:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="text-[16px] sm:text-[18px] font-semibold truncate">
                {data.orderNumber}
              </div>
              <div className="text-[11px] sm:text-[12px] text-slate-500 truncate">
                {placedStr}
              </div>
            </div>

            <span
              className={`ml-1 sm:ml-2 inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-[12px] ring-1 shrink-0 ${badge}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current/60" />
              {data.status}
            </span>
          </div>

          {/* right actions: icons on mobile; full buttons on md+ */}
          <div className="hidden md:flex items-center gap-2">
            {invoice?.pdfUrl ? (
              <a
                href={invoice.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <ReceiptText className="w-4 h-4" />
                Receipt
              </a>
            ) : (
              <button
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm inline-flex items-center gap-2 cursor-not-allowed"
                title="Invoice not available"
              >
                <ReceiptText className="w-4 h-4" />
                Receipt
              </button>
            )}

            <button
              onClick={() => setShowDeliveryPicker(true)}
              className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50 inline-flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Set delivery time
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="h-9 px-3 rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 text-sm inline-flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>

            {canAdvance ? (
              <button className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm inline-flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                Advance status
              </button>
            ) : (
              <button
                className="h-9 px-3 rounded-lg bg-slate-100 text-slate-500 text-sm inline-flex items-center gap-2 cursor-not-allowed"
                title="Hook to seller status API to enable"
              >
                <Truck className="w-4 h-4" />
                Update status
              </button>
            )}
          </div>

          {/* mobile condensed menu */}
          <div className="md:hidden relative">
            <button
              onClick={() => setShowMore((s) => !s)}
              className="h-9 w-9 rounded-full border border-slate-200 bg-white inline-flex items-center justify-center"
              aria-label="More"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMore && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1 z-50"
                role="menu"
              >
                <button
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 inline-flex items-center gap-2"
                  onClick={() => {
                    setShowMore(false);
                    setShowDeliveryPicker(true);
                  }}
                >
                  <Clock className="w-4 h-4" /> Delivery time
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 inline-flex items-center gap-2 text-rose-700"
                  onClick={() => {
                    setShowMore(false);
                    setShowCancelModal(true);
                  }}
                >
                  <XCircle className="w-4 h-4" /> Cancel order
                </button>
                {invoice?.pdfUrl ? (
                  <a
                    href={invoice.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-3 py-2 rounded-lg text-sm hover:bg-slate-50 inline-flex items-center gap-2"
                  >
                    <ReceiptText className="w-4 h-4" /> Receipt
                  </a>
                ) : (
                  <div className="px-3 py-2 rounded-lg text-sm text-slate-400 inline-flex items-center gap-2">
                    <ReceiptText className="w-4 h-4" /> Receipt not available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-2 sm:p-3 md:p-6 grid lg:grid-cols-[2fr_1fr] gap-3 sm:gap-4 md:gap-6">
        {/* Left column */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Customer & Shipping */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="text-[14px] sm:text-[15px] font-semibold">
                Customer
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href={
                    data.Shipping?.phoneNumber
                      ? `tel:${data.Shipping.phoneNumber}`
                      : undefined
                  }
                  className={`h-9 w-9 rounded-full border border-slate-200 text-slate-600 inline-flex items-center justify-center ${
                    data.Shipping?.phoneNumber
                      ? "hover:bg-slate-50"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                  aria-label="Call customer"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={
                    data.Shipping?.phoneNumber
                      ? `https://wa.me/${data.Shipping.phoneNumber}`
                      : undefined
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={`h-9 w-9 rounded-full border border-slate-200 text-slate-600 inline-flex items-center justify-center ${
                    data.Shipping?.phoneNumber
                      ? "hover:bg-slate-50"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="p-3 sm:p-4 grid md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-[11px] sm:text-[12px] uppercase tracking-wide text-slate-500 mb-1">
                  Bill To
                </div>
                <div className="flex items-start gap-2">
                  <User2 className="w-4 h-4 mt-[2px] text-slate-500" />
                  <div className="text-[13px] sm:text-[14px] text-slate-700">
                    {data.Shipping?.fullName || "-"}{" "}
                    <span className="text-slate-500">
                      {data.Shipping?.phoneNumber
                        ? `• ${data.Shipping.phoneNumber}`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] sm:text-[12px] uppercase tracking-wide text-slate-500 mb-1">
                  Shipping Address
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-[2px] text-slate-500" />
                  <div className="text-[13px] sm:text-[14px] text-slate-700 leading-5">
                    {data.Shipping?.address || "-"}
                    {data.Shipping?.city ? `, ${data.Shipping.city}` : ""}
                    {data.Shipping?.state ? `, ${data.Shipping.state}` : ""}
                    {data.Shipping?.country ? `, ${data.Shipping.country}` : ""}
                    {data.Shipping?.postalCode
                      ? `, ${data.Shipping.postalCode}`
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-3 sm:p-4 border-b border-slate-100 text-[14px] sm:text-[15px] font-semibold">
              Products
            </div>
            <ul className="divide-y divide-slate-100">
              {data.OrderItem.map((it) => (
                <li key={it.id} className="p-3 sm:p-4 flex items-start gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                    <IndianRupee className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] sm:text-[14px] font-medium text-slate-900 line-clamp-2">
                      {it.Product?.name ?? "—"}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-slate-500">
                      ID: {it.Product?.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] sm:text-[13px] text-slate-600">
                      ₹ {Number(it.unitPrice)} × {Number(it.quantity)}
                    </div>
                    <div className="text-[13px] sm:text-[14px] font-semibold text-slate-900">
                      {currencyINR(
                        Number(it.totalPrice) ||
                          Number(it.unitPrice) * Number(it.quantity)
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-3 sm:p-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[12px] sm:text-[13px]">
                <span className="text-slate-600">Item Total</span>
                <span className="font-medium text-slate-900">
                  {currencyINR(itemsTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[14px] sm:text-[15px] font-semibold">
                <span>Total Amount</span>
                <span>{currencyINR(Number(data.totalAmount))}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Payment / Mode */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-3 sm:p-4 border-b border-slate-100 text-[14px] sm:text-[15px] font-semibold">
              Payment & Mode
            </div>
            <div className="p-3 sm:p-4 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Mode</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 ring-1 ring-teal-200">
                  Delivery
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Payment</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-violet-50 text-violet-700 ring-1 ring-violet-200">
                  {data.Payment?.method || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Payment Status</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                  {data.Payment?.status || "—"}
                </span>
              </div>
            </div>
          </section>

          {/* Activity timeline (from /tracking) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-3 sm:p-4 border-b border-slate-100 text-[14px] sm:text-[15px] font-semibold flex items-center justify-between">
              <span>Activity</span>
              <button className="inline-flex items-center gap-1 text-[12px] text-blue-600 hover:underline">
                Add note
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 sm:p-4 space-y-4">
              {track?.logs?.length ? (
                track.logs.map((l, idx) => (
                  <Step
                    key={idx}
                    active={idx === 0}
                    title={l.status}
                    subtitle={new Date(l.updatedAt).toLocaleString()}
                  />
                ))
              ) : (
                <>
                  <Step active title={track?.currentStep || "In progress"} />
                  {track?.nextStep ? <Step title={track.nextStep} /> : null}
                </>
              )}
            </div>
          </section>

          {/* Quick actions */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-3 sm:p-4 border-b border-slate-100 text-[14px] sm:text-[15px] font-semibold">
              Actions
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                disabled
                className="h-10 px-3 rounded-lg bg-slate-100 text-slate-500 text-sm inline-flex items-center justify-center gap-2 cursor-not-allowed"
                title="Connect seller status update API to enable"
              >
                <CheckCircle2 className="w-4 h-4" />
                Advance status
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="h-10 px-3 rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 text-sm inline-flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel order
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky bottom bar (mobile-first prominent) */}
      <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-2 sm:px-3 md:px-6 py-2 flex items-center justify-between gap-2">
          <div className="text-[13px] sm:text-[14px] text-slate-600 truncate">
            Total:{" "}
            <span className="font-semibold text-slate-900">
              {currencyINR(Number(data.totalAmount))}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowDeliveryPicker(true)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 inline-flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden xs:inline">Delivery time</span>
              <span className="xs:hidden">Delivery</span>
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="h-10 px-3 rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 text-sm inline-flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Cancel order</span>
              <span className="xs:hidden">Cancel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delivery picker modal */}
      {showDeliveryPicker && (
        <DeliveryTimeModal
          onClose={() => setShowDeliveryPicker(false)}
          onConfirm={() => setShowDeliveryPicker(false)}
        />
      )}

      {/* Cancel confirm modal */}
      <CancelConfirmModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
      />
    </div>
  );
};

export default OrderDetailsPage;
