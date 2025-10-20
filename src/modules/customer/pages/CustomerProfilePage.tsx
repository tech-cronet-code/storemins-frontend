// src/modules/customer/pages/CustomerProfilePage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BottomNav from "../../../shared/blocks/BottomNav";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import {
  useGetMyOrdersQuery,
  type MyOrdersItem,
} from "../services/customerOrderApi";

/* ------------------------ helpers ------------------------ */
const withSlug = (path: string, slug?: string | null) =>
  slug
    ? `/${slug}${path.startsWith("/") ? path : `/${path}`}`
    : path.startsWith("/")
    ? path
    : `/${path}`;

const currencyINR = (v: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v);

/** Full delivery pipeline mapping.
 * Defaults to PREPARING when order is placed or status is missing/unknown.
 */
type DeliveryUiStatus =
  | "preparing"
  | "dispatched"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "return_initiated"
  | "returned";

const normalizeStatus = (o: MyOrdersItem): DeliveryUiStatus => {
  const s = (o.status || "").toUpperCase().replace(/\s+/g, "_");
  const step = (o.OrderTrackingStatus?.currentStep || "")
    .toUpperCase()
    .replace(/\s+/g, "_");

  const pick = (val: string): DeliveryUiStatus | undefined => {
    if (val.includes("DELIVERED")) return "delivered";
    if (val.includes("OUT_FOR_DELIVERY")) return "out_for_delivery";
    if (val.includes("IN_TRANSIT")) return "in_transit";
    if (val.includes("DISPATCHED")) return "dispatched";
    if (val.includes("PREPARING") || val.includes("PLACED")) return "preparing";
    if (val.includes("FAILED")) return "failed";
    if (val.includes("RETURN_INITIATED")) return "return_initiated";
    if (val.includes("RETURNED")) return "returned";
    return undefined;
  };

  // Prefer explicit order.status, then tracking step, else default to PREPARING
  return pick(s) || pick(step) || "preparing";
};

/* ------------------------ tiny SVG icon set ------------------------ */
const Icon = {
  Back: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Edit: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 21h4l11-11-4-4L4 17v4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  DotsVertical: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  ),
  Chevron: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  MapPin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
    </svg>
  ),
  Info: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 1010 10A10.012 10.012 0 0012 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z" />
    </svg>
  ),
  Basket: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M3 10h18l-1.5 9a2 2 0 01-2 2h-11a2 2 0 01-2-2L3 10Zm6-6l-4 6m10-6l4 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Receipt: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  CheckCircle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9z" />
    </svg>
  ),
  Truck: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M3 7h10v8H3zM13 10h4l3 3v2h-7V10zM6 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  XCircle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 1010 10A10.012 10.012 0 0012 2Zm4.3 13.9-1.4 1.4L12 13.4l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 2.9 2.9 2.9-2.9 1.4 1.4-2.9 2.9Z" />
    </svg>
  ),
  Logout: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M15 12H3m12 0-3-3m3 3-3 3M9 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* ----------------------------- reusable list row ----------------------------- */
function ListRow({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
          {icon}
        </div>
        <div>
          <div className="text-[15px] font-medium text-slate-900">{title}</div>
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
      </div>
      <Icon.Chevron className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
    </Link>
  );
}

/* ----------------------------- initials avatar ---------------------------- */
function InitialAvatar({ name }: { name?: string }) {
  const initials = useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }, [name]);

  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/35 text-white font-semibold">
      {initials.toUpperCase()}
    </div>
  );
}

/* ------------------------------ stat card ------------------------------ */
function StatCard({
  label,
  value,
  icon,
  to,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  to?: string;
}) {
  const Card = (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 hover:shadow-sm transition">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">{label}</div>
        {icon && (
          <div className="h-6 w-6 grid place-items-center rounded-full bg-violet-50 ring-1 ring-violet-100 text-violet-700">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-1 text-[20px] font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
  return to ? <Link to={to}>{Card}</Link> : Card;
}

/* ------------------------------ status badge ----------------------------- */
function StatusBadge({ status }: { status: DeliveryUiStatus }) {
  const map = {
    preparing: {
      cls: "bg-amber-50 text-amber-700 ring-amber-200",
      label: "Preparing",
      icon: <Icon.Truck className="h-3.5 w-3.5" />,
    },
    dispatched: {
      cls: "bg-blue-50 text-blue-700 ring-blue-200",
      label: "Dispatched",
      icon: <Icon.Truck className="h-3.5 w-3.5" />,
    },
    in_transit: {
      cls: "bg-sky-50 text-sky-700 ring-sky-200",
      label: "In Transit",
      icon: <Icon.Truck className="h-3.5 w-3.5" />,
    },
    out_for_delivery: {
      cls: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      label: "Out for Delivery",
      icon: <Icon.Truck className="h-3.5 w-3.5" />,
    },
    delivered: {
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      label: "Delivered",
      icon: <Icon.CheckCircle className="h-3.5 w-3.5" />,
    },
    failed: {
      cls: "bg-rose-50 text-rose-700 ring-rose-200",
      label: "Failed",
      icon: <Icon.XCircle className="h-3.5 w-3.5" />,
    },
    return_initiated: {
      cls: "bg-orange-50 text-orange-700 ring-orange-200",
      label: "Return Initiated",
      icon: <Icon.Truck className="h-3.5 w-3.5" />,
    },
    returned: {
      cls: "bg-gray-50 text-gray-700 ring-gray-200",
      label: "Returned",
      icon: <Icon.CheckCircle className="h-3.5 w-3.5" />,
    },
  } as const;

  const item = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${item.cls}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

/* ------------------------------ Kebab menu ------------------------------ */
function useOutsideClose<T extends HTMLElement>(
  open: boolean,
  onClose: () => void
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);
  return ref;
}

function KebabMenu({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));
  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-10 w-10 rounded-full bg-white/15 text-white grid place-items-center backdrop-blur hover:bg-white/20 transition"
        title="Menu"
      >
        <Icon.DotsVertical className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-black/10 overflow-hidden"
        >
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50"
          >
            <Icon.Logout className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================= PAGE ================================== */
export default function CustomerProfilePage() {
  const { storeSlug } = useParams<{ storeSlug?: string }>();
  const navigate = useNavigate();
  const auth = useCustomerAuth();

  /* ---- profile heading ---- */
  const [profile, setProfile] = useState<{
    name?: string | null;
    mobile?: string | null;
  }>(() => {
    const ctx = {
      name: (auth as any)?.user?.name,
      mobile: (auth as any)?.user?.mobile,
    };
    try {
      const ls = JSON.parse(localStorage.getItem("customer_profile") || "null");
      return {
        name: ctx.name ?? ls?.name ?? null,
        mobile: ctx.mobile ?? ls?.mobile ?? null,
      };
    } catch {
      return ctx;
    }
  });

  useEffect(() => {
    setProfile({
      name: (auth as any)?.user?.name ?? profile.name ?? null,
      mobile: (auth as any)?.user?.mobile ?? profile.mobile ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(auth as any)?.user?.name, (auth as any)?.user?.mobile]);

  const [editOpen, setEditOpen] = useState(false);
  const handleSaveProfile = async (data: { name: string; mobile: string }) => {
    const updater =
      (auth as any)?.updateProfile ||
      (auth as any)?.setUser ||
      (auth as any)?.setUserDetails;
    try {
      if (typeof updater === "function") {
        const payload =
          updater === (auth as any).setUser ||
          updater === (auth as any).setUserDetails
            ? { ...(auth as any).user, ...data }
            : data;
        await Promise.resolve(updater(payload));
      } else {
        localStorage.setItem("customer_profile", JSON.stringify(data));
        window.dispatchEvent(
          new CustomEvent("auth:profile:update", { detail: data })
        );
      }
      setProfile(data);
      setEditOpen(false);
    } catch {
      alert("Failed to save profile. Please try again.");
    }
  };

  /* ---- compute a reliable businessId for API ---- */
  const userDetails = (auth as any)?.userDetails;
  const slugFromUrl =
    storeSlug ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean)[0]
      : "");
  const businessId: string =
    userDetails?.storeLinks?.find(
      (l: any) => l?.store?.slug === slugFromUrl || l?.storeSlug === slugFromUrl
    )?.businessId ||
    userDetails?.storeLinks?.[0]?.businessId ||
    localStorage.getItem("active_business_id") ||
    "";

  /* ---- orders from API ---- */
  // NOTE: your API still uses 'ONGOING'/'COMPLETED'—we keep these tabs for fetch,
  // but the UI displays detailed delivery stages via normalizeStatus().
  const [tab, setTab] = useState<"all" | "ongoing" | "completed">("all");
  const statusParam =
    tab === "all" ? undefined : (tab.toUpperCase() as "ONGOING" | "COMPLETED");

  const {
    data: ordersRes,
    isFetching,
    isError,
    refetch,
  } = useGetMyOrdersQuery(
    { businessId, status: statusParam, page: 1, limit: 20 },
    { skip: !businessId }
  );

  const apiOrders = ordersRes?.items ?? [];
  const ordersCount = ordersRes?.total ?? 0;

  const uiOrders = useMemo(
    () =>
      apiOrders.map((o) => {
        const status = normalizeStatus(o);
        const items = o.OrderItem.map((it) => ({
          title: it.Product?.name || "Item",
          qty: it.quantity,
          price: it.totalPrice,
          image: "", // (plug image when BE exposes it)
        }));
        return {
          id: o.orderNumber || o.id,
          placedAt: o.placedAt,
          status,
          total: o.totalAmount,
          originalTotal: undefined as number | undefined,
          items,
          rawId: o.id,
        };
      }),
    [apiOrders]
  );

  const rewards = "—";
  const coupons = "—";
  const wallet = "—";

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ===== Header ===== */}
      <div className="-mx-4 -mt-4">
        <header
          className="
            relative isolate rounded-b-[28px]
            bg-[radial-gradient(100%_120%_at_0%_0%,rgba(255,255,255,0.14),transparent_40%),linear-gradient(135deg,#7c3aed_0%,#c026d3_50%,#7c3aed_100%)]
            shadow-[inset_0_-24px_64px_-40px_rgba(255,255,255,0.35)]
          "
        >
          {/* toolbar */}
          <div className="max-w-3xl mx-auto px-4 pt-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="h-10 w-10 rounded-full bg-white/15 text-white grid place-items-center backdrop-blur hover:bg-white/20 transition"
                aria-label="Back"
              >
                <Icon.Back className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur hover:bg-white/20 transition"
                  title="Edit profile"
                >
                  <Icon.Edit className="h-4 w-4" />
                  <span className="text-xs font-medium">Edit</span>
                </button>
                <KebabMenu onLogout={auth.logout} />
              </div>
            </div>
          </div>

          {/* name & phone */}
          <div className="max-w-3xl mx-auto px-4 pb-6 pt-8">
            <div className="flex items-center gap-3 text-white">
              <InitialAvatar name={profile.name || undefined} />
              <div>
                <div className="text-[22px] sm:text-2xl font-bold tracking-wide drop-shadow-sm">
                  {profile.name || "—"}
                </div>
                <div className="text-[13px] sm:text-sm/5 opacity-95">
                  {profile.mobile || "—"}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ===== Content ===== */}
      <main className="max-w-3xl mx-auto px-4 pb-24 pt-6">
        {/* Actions */}
        <section className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
          <ListRow
            to={withSlug("/profile/addresses", storeSlug)}
            icon={<Icon.MapPin className="h-5 w-5" />}
            title="Your saved addresses"
            subtitle="Manage delivery locations"
          />
          <div className="mx-5 border-t border-slate-100" />
          <ListRow
            to={withSlug("/profile/help", storeSlug)}
            icon={<Icon.Info className="h-5 w-5" />}
            title="Help & support"
            subtitle="FAQs and contact options"
          />
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Rewards" value={rewards} />
          <StatCard label="Coupons" value={coupons} />
          <StatCard label="Wallet" value={wallet} />
          <StatCard
            label="Orders"
            value={isFetching ? "…" : ordersCount}
            icon={<Icon.Receipt className="h-3.5 w-3.5" />}
            to={withSlug("/profile/orders", storeSlug)}
          />
        </section>

        {/* Orders */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Your orders
            </h2>

            {/* Tabs (using API's Ongoing/Completed buckets) */}
            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
              {(["all", "ongoing", "completed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "px-3 py-1.5 text-xs font-medium rounded-full transition",
                    tab === t
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-800",
                  ].join(" ")}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Missing business ID */}
          {!businessId && (
            <div className="rounded-3xl bg-white ring-1 ring-amber-200 p-6 text-amber-700">
              Business not selected. Please open the store again.
            </div>
          )}

          {/* Loading */}
          {businessId && isFetching && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-white ring-1 ring-black/5 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {businessId && isError && !isFetching && (
            <div className="rounded-3xl bg-white ring-1 ring-rose-200 p-6 text-rose-600">
              Failed to load orders.{" "}
              <button
                className="underline font-medium"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {businessId && !isFetching && !isError && uiOrders.length === 0 && (
            <div className="rounded-3xl bg-white ring-1 ring-black/5 p-8 text-center">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-violet-50 grid place-items-center ring-1 ring-violet-100">
                <Icon.Basket className="h-10 w-10 text-violet-600" />
              </div>
              <div className="text-base font-semibold text-slate-900">
                Nothing here yet
              </div>
              <div className="text-sm text-slate-500">
                All your orders will be available here
              </div>
              <Link
                to={withSlug("/", storeSlug)}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition"
              >
                Explore products
              </Link>
            </div>
          )}

          {/* List */}
          {businessId && !isFetching && !isError && uiOrders.length > 0 && (
            <div className="space-y-3">
              {uiOrders.map((o) => {
                const first = o.items[0];
                const rest = o.items.length - 1;
                const date = new Date(o.placedAt).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "2-digit" }
                );

                return (
                  <div
                    key={o.id}
                    className="rounded-2xl bg-white ring-1 ring-black/5 p-4 sm:p-5"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] sm:text-sm text-slate-600">
                        <span className="font-medium text-slate-900">
                          {o.id}
                        </span>{" "}
                        • Placed on {date}
                      </div>
                      <StatusBadge status={o.status} />
                    </div>

                    {/* Body */}
                    <div className="mt-3 flex items-start gap-3">
                      {/* Image stack (images TBD when BE provides) */}
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 3).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-slate-200 bg-slate-100"
                          />
                        ))}
                        {o.items.length > 3 && (
                          <div className="h-10 w-10 grid place-items-center rounded-lg ring-1 ring-slate-200 bg-slate-50 text-[11px] text-slate-600">
                            +{o.items.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Titles */}
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium text-slate-900 truncate">
                          {first?.title || "Items"}
                        </div>
                        <div className="text-xs text-slate-500">
                          Qty: {first?.qty ?? 1}
                          {rest > 0
                            ? ` • +${rest} more item${rest > 1 ? "s" : ""}`
                            : ""}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Total</div>
                        <div className="text-[15px] font-semibold">
                          {currencyINR(o.total)}
                        </div>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Link
                        to={withSlug(`/profile/orders/${o.id}`, storeSlug)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View details
                      </Link>
                      {(
                        [
                          "preparing",
                          "dispatched",
                          "in_transit",
                          "out_for_delivery",
                        ] as DeliveryUiStatus[]
                      ).includes(o.status) && (
                        <Link
                          to={withSlug(
                            `/profile/orders/${o.id}/track`,
                            storeSlug
                          )}
                          className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                        >
                          Track
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editOpen}
        name={profile.name || ""}
        mobile={profile.mobile || ""}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
      />

      <BottomNav />
    </div>
  );
}

/* ---------------------------- Edit Profile Modal ---------------------------- */
function EditProfileModal({
  open,
  name: nameProp,
  mobile: mobileProp,
  onClose,
  onSave,
}: {
  open: boolean;
  name?: string | null;
  mobile?: string | null;
  onClose: () => void;
  onSave: (data: { name: string; mobile: string }) => void;
}) {
  const [name, setName] = useState(nameProp || "");
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(nameProp || "");
    setTimeout(() => nameRef.current?.focus(), 0);
  }, [open, nameProp]);

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Please enter your name.");
      return;
    }
    onSave({ name: trimmed, mobile: mobileProp || "" });
  };

  return (
    <div
      className="fixed inset-0 z-[4000] bg-black/40 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3">
          <div className="text-[16px] font-semibold">Edit profile</div>
          <div className="mt-3 space-y-3">
            <label className="block">
              <div className="text-xs text-slate-600 mb-1">Full name</div>
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-violet-300"
                placeholder="Your name"
              />
            </label>

            {/* Read-only mobile field */}
            <label className="block">
              <div className="text-xs text-slate-600 mb-1">Mobile</div>
              <input
                value={mobileProp || ""}
                readOnly
                title="Mobile number is locked. Contact support to change."
                className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-100 text-slate-500 cursor-not-allowed"
                placeholder="Phone number"
                inputMode="tel"
              />
              <div className="mt-1 text-[11px] text-slate-500">
                To change your mobile number, please contact support.
              </div>
            </label>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="h-10 px-4 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
