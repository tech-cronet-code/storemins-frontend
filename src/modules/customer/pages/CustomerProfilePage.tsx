// src/modules/customer/pages/CustomerProfilePage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useMemo, useState } from "react";

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
      <path d="M12 2a10 10 0 1010 10A10.012 10.012 0 0012 2Zm4.3 13.9l-1.4 1.4L12 13.4l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 2.9 2.9 2.9-2.9 1.4 1.4-2.9 2.9Z" />
    </svg>
  ),
};

/* --------------------------- reusable list row --------------------------- */
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

/* ------------------------------ order types ------------------------------ */
type OrderStatus = "ongoing" | "completed" | "cancelled";
type OrderItem = {
  title: string;
  qty: number;
  price: number;
  image?: string;
};
type Order = {
  id: string;
  placedAt: string; // ISO or friendly
  status: OrderStatus;
  total: number;
  originalTotal?: number; // 👈 Added: crossed MRP/Original total
  items: OrderItem[];
};

/* ------------------------------ status badge ----------------------------- */
function StatusBadge({ status }: { status: OrderStatus }) {
  const map = {
    ongoing: {
      cls: "bg-amber-50 text-amber-700 ring-amber-200",
      icon: <Icon.Truck className="h-3.5 w-3.5" />,
      label: "On the way",
    },
    completed: {
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: <Icon.CheckCircle className="h-3.5 w-3.5" />,
      label: "Delivered",
    },
    cancelled: {
      cls: "bg-rose-50 text-rose-700 ring-rose-200",
      icon: <Icon.XCircle className="h-3.5 w-3.5" />,
      label: "Cancelled",
    },
  }[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        "ring-1",
        map.cls,
      ].join(" ")}
    >
      {map.icon}
      {map.label}
    </span>
  );
}

/* ================================= PAGE ================================== */
export default function CustomerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ------- DEMO ORDERS (replace with API later) -------
  const demoOrders: Order[] = [
    {
      id: "ODR-982341",
      placedAt: "2025-05-22",
      status: "ongoing",
      total: 58990,
      originalTotal: 61990, // 👈 crossed price
      items: [
        {
          title: "MacBook Air 13” (M2) · Midnight",
          qty: 1,
          price: 52990,
          image: "https://dummyimage.com/80x60/111827/ffffff&text=MB",
        },
        {
          title: "USB-C to MagSafe 3 Cable",
          qty: 1,
          price: 6000,
          image: "https://dummyimage.com/80x60/0f172a/ffffff&text=CAB",
        },
      ],
    },
    {
      id: "ODR-982112",
      placedAt: "2025-05-05",
      status: "completed",
      total: 2999,
      originalTotal: 3499, // 👈 crossed price
      items: [
        {
          title: "Wireless Mouse · Graphite",
          qty: 1,
          price: 1499,
          image: "https://dummyimage.com/80x60/111827/ffffff&text=MS",
        },
        {
          title: "Mouse Pad XL",
          qty: 1,
          price: 1500,
          image: "https://dummyimage.com/80x60/1f2937/ffffff&text=PAD",
        },
      ],
    },
    {
      id: "ODR-981930",
      placedAt: "2025-04-18",
      status: "completed",
      total: 39990,
      originalTotal: 41990, // 👈 crossed price
      items: [
        {
          title: "OnePlus 12R · 8/128 · Iron Gray",
          qty: 1,
          price: 39990,
          image: "https://dummyimage.com/80x60/111827/ffffff&text=PHN",
        },
      ],
    },
  ];

  // Stats
  const rewards = "—";
  const coupons = "—";
  const wallet = "—";
  const ordersCount = demoOrders.length;

  // Orders filter
  const [tab, setTab] = useState<"all" | "ongoing" | "completed">("all");

  const filtered = useMemo(() => {
    if (tab === "all") return demoOrders;
    return demoOrders.filter((o) => o.status === tab);
  }, [tab]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ===== Header bar with name in the gradient (no glass card) ===== */}
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
            <button
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur hover:bg-white/20 transition"
              title="Edit profile"
            >
              <Icon.Edit className="h-4 w-4" />
              <span className="text-xs font-medium">Edit</span>
            </button>
          </div>
        </div>

        {/* name & phone inside bar */}
        <div className="max-w-3xl mx-auto px-4 pb-6 pt-8">
          <div className="flex items-center gap-3 text-white">
            <InitialAvatar name={user?.name} />
            <div>
              <div className="text-[22px] sm:text-2xl font-bold tracking-wide drop-shadow-sm">
                {user?.name || "—"}
              </div>
              <div className="text-[13px] sm:text-sm/5 opacity-95">
                {user?.mobile}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Content ===== */}
      <main className="max-w-3xl mx-auto px-4 pb-24 pt-6">
        {/* Actions */}
        <section className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
          <ListRow
            to="/profile/addresses"
            icon={<Icon.MapPin className="h-5 w-5" />}
            title="Your saved addresses"
            subtitle="Manage delivery locations"
          />
          <div className="mx-5 border-t border-slate-100" />
          <ListRow
            to="/profile/help"
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
            value={ordersCount}
            icon={<Icon.Receipt className="h-3.5 w-3.5" />}
            to="/profile/orders"
          />
        </section>

        {/* Orders */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Your orders
            </h2>

            {/* Tabs */}
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

          {/* List */}
          {filtered.length === 0 ? (
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
                to="/"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition"
              >
                Explore products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((o) => {
                const first = o.items[0];
                const rest = o.items.length - 1;
                const date = new Date(o.placedAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }
                );
                const currencyINR = (v: number) =>
                  "₹" +
                  new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                  }).format(v);

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
                      {/* Image stack */}
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 3).map((it, idx) => (
                          <div
                            key={idx}
                            className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-slate-200 bg-slate-100"
                          >
                            <img
                              src={
                                it.image ||
                                "https://dummyimage.com/80x60/e5e7eb/111827&text=IMG"
                              }
                              alt={it.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
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
                          {first.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          Qty: {first.qty}
                          {rest > 0
                            ? ` • +${rest} more item${rest > 1 ? "s" : ""}`
                            : ""}
                        </div>
                      </div>

                      {/* Total + crossed original */}
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Total</div>
                        <div className="text-[15px] font-semibold">
                          {currencyINR(o.total)}
                        </div>
                        {o.originalTotal && o.originalTotal > o.total && (
                          <div className="text-xs text-slate-400 line-through">
                            {currencyINR(o.originalTotal)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Link
                        to={`/profile/orders/${o.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View details
                      </Link>
                      {o.status === "ongoing" && (
                        <Link
                          to={`/profile/orders/${o.id}/track`}
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
    </div>
  );
}
