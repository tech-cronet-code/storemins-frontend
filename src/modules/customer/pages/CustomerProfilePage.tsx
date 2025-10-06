// src/modules/customer/pages/CustomerProfilePage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useMemo } from "react";

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

/* ================================= PAGE ================================== */
export default function CustomerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Demo numbers (replace with API later)
  const rewards = "—";
  const coupons = "—";
  const wallet = "—";
  const ordersCount = 0; // 👈 total order history count (demo)

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
            to="/profile#help"
            icon={<Icon.Info className="h-5 w-5" />}
            title="Help & support"
            subtitle="FAQs and contact options"
          />
        </section>

        {/* Stats (now 4 cards, includes Orders total) */}
        <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Rewards" value={rewards} />
          <StatCard label="Coupons" value={coupons} />
          <StatCard label="Wallet" value={wallet} />
          <StatCard
            label="Orders"
            value={ordersCount}
            icon={<Icon.Receipt className="h-3.5 w-3.5" />}
            to="/profile/orders" // change if your route differs
          />
        </section>

        {/* Orders */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Your orders
            </h2>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
              <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-white shadow-sm">
                All
              </button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-full text-slate-600">
                Ongoing
              </button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-full text-slate-600">
                Completed
              </button>
            </div>
          </div>

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
        </section>
      </main>
    </div>
  );
}
