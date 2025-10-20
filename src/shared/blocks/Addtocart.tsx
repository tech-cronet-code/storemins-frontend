/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BottomNav from "./BottomNav";

/* --- auth (for businessId) --- */
import { useSellerAuth } from "../../modules/auth/contexts/SellerAuthContext";

/* --- customer cart API (ALL cart ops) --- */
import {
  useGetActiveCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useApplyCouponOnCartMutation,
  useUpsertDraftFromCartMutation,
  CartItem,
} from "../../modules/customer/services/customerCartApi";

/* --- customer address API (list addresses) --- */
import {
  useGetCustomerAddressesQuery,
  CustomerAddress,
} from "../../modules/customer/services/customerApi";

/* -------------------------------- UI helpers -------------------------------- */

type AddressKind = "home" | "work" | "other";
const APP_BAR_H = 56;

const currencyINR = (v: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v);

const Divider: React.FC<{ dashed?: boolean; className?: string }> = ({
  dashed,
  className,
}) => (
  <div
    className={[
      "border-t",
      dashed ? "border-dashed border-slate-300" : "border-slate-200/70",
      className || "",
    ].join(" ")}
  />
);

const Pill = ({
  tone = "slate",
  children,
}: {
  tone?: "slate" | "emerald" | "amber";
  children: React.ReactNode;
}) => {
  const t =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${t}`}
    >
      {children}
    </span>
  );
};

type IconBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ariaLabel?: string;
};
const IconBtn = React.forwardRef<HTMLButtonElement, IconBtnProps>(
  ({ className, ariaLabel, children, ...props }, ref) => (
    <button
      aria-label={ariaLabel}
      ref={ref}
      {...props}
      className={[
        "h-9 w-9 inline-flex items-center justify-center rounded-full",
        "border border-slate-200/80 bg-white shadow-sm",
        "hover:bg-slate-50 active:scale-[0.96] transition",
        "focus:outline-none focus:ring-2 focus:ring-sky-300/60",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
        className || "",
      ].join(" ")}
    >
      {children}
    </button>
  )
);
IconBtn.displayName = "IconBtn";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener?.("change", handler);
    (mql as any).addListener?.(handler);
    return () => {
      mql.removeEventListener?.("change", handler);
      (mql as any).removeListener?.(handler);
    };
  }, [query]);
  return matches;
}

/* ------------------------------- thumbs ------------------------------- */

const FALLBACK_IMG =
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'><rect width='100%' height='100%' fill='#f3f4f6'/><g fill='#9ca3af' font-family='system-ui,Segoe UI,Roboto,sans-serif' font-size='12' text-anchor='middle'><text x='80' y='64'>Image</text></g></svg>`
  );

function firstMediaUrl(i?: CartItem) {
  const u = i?.Product?.Media?.[0]?.url;
  return u && String(u).trim() ? String(u) : FALLBACK_IMG;
}

/* --------------------------- Qty Stepper (click only) --------------------------- */
const QtyStepper: React.FC<{
  value: number;
  onBump: (delta: 1 | -1) => void;
}> = ({ value, onBump }) => {
  const atMin = value <= 1;

  const handleClick =
    (dir: -1 | 1) => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (e.detail !== 1) return;
      if (dir === -1 && atMin) return;
      onBump(dir as 1 | -1);
    };

  const handleKeyDown =
    (dir: -1 | 1) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
        e.preventDefault();
        if (dir === -1 && atMin) return;
        onBump(dir as 1 | -1);
      }
    };

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-300 overflow-hidden bg-white">
      <button
        type="button"
        onClick={handleClick(-1)}
        onKeyDown={handleKeyDown(-1)}
        disabled={atMin}
        className={[
          "px-3 py-1.5 hover:bg-slate-50",
          atMin ? "opacity-40 cursor-not-allowed" : "",
        ].join(" ")}
        aria-label="Decrease"
        title={atMin ? "Minimum quantity is 1" : "Decrease quantity"}
      >
        –
      </button>

      <input
        readOnly
        value={String(value)}
        aria-label="Quantity"
        className="w-14 text-center text-[14px] font-mono tabular-nums outline-none select-none"
        onWheel={(e) => e.currentTarget.blur()}
      />

      <button
        type="button"
        onClick={handleClick(1)}
        onKeyDown={handleKeyDown(1)}
        className="px-3 py-1.5 hover:bg-slate-50"
        aria-label="Increase"
        title="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

/* ----------------------- Address picker (modal) ----------------------- */
function KindGlyph({ kind }: { kind: AddressKind }) {
  if (kind === "home")
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-violet-600"
        fill="currentColor"
      >
        <path d="M3 10.5 12 4l9 6.5V20a2 2 0 01-2 2h-5v-6h-4v6H5a2 2 0 01-2-2v-9.5Z" />
      </svg>
    );
  if (kind === "work")
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-violet-600"
        fill="currentColor"
      >
        <path d="M9 4h6a2 2 0 012 2v2h3a2 2 0 012 2v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7a2 2 0 012-2h3V6a2 2 0 012-2Zm0 4h6V6H9v2Z" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-violet-600"
      fill="currentColor"
    >
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
    </svg>
  );
}

type AddressPickerProps = {
  open: boolean;
  addresses: CustomerAddress[];
  selectedId?: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  saving?: boolean; // NEW: show loading state on persist
  addressesPath: string; // NEW: slug-aware path to /profile/addresses
};
const AddressPicker: React.FC<AddressPickerProps> = ({
  open,
  addresses,
  selectedId,
  onClose,
  onSelect,
  saving = false,
  addressesPath,
}) => {
  const [active, setActive] = useState<string | null>(selectedId ?? null);
  useEffect(() => setActive(selectedId ?? null), [selectedId, open]);
  if (!open) return null;

  const hasAddrs = addresses.length > 0;

  return (
    <div className="fixed inset-0 z-[6500]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[480px]">
        <div className="h-auto sm:h-full rounded-t-2xl sm:rounded-none sm:rounded-l-2xl bg-white shadow-2xl ring-1 ring-black/10 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-semibold">
              Choose delivery address
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div className="mt-3 max-h-[60vh] sm:max-h-[70vh] overflow-auto space-y-2">
            {!hasAddrs ? (
              <div className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">
                You don’t have any saved addresses yet.
              </div>
            ) : (
              addresses.map((a) => (
                <label
                  key={a.id}
                  className={[
                    "flex items-start gap-3 rounded-2xl border p-3 cursor-pointer",
                    active === a.id
                      ? "border-violet-300 bg-violet-50/40"
                      : "border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="addr"
                    value={a.id}
                    checked={active === a.id}
                    onChange={() => setActive(a.id)}
                    className="mt-1 h-4 w-4 text-violet-600 border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <KindGlyph kind={a.kind as AddressKind} />
                      <div className="text-[14px] font-medium text-slate-900">
                        {a.label}
                      </div>
                      {a.isDefault && <Pill tone="emerald">Default</Pill>}
                      <Pill>
                        {a.kind === "home"
                          ? "Home"
                          : a.kind === "work"
                          ? "Work"
                          : "Other"}
                      </Pill>
                    </div>
                    <div className="text-[12px] text-slate-600 mt-1 truncate">
                      {[a.line1, a.line2, a.city, a.state, a.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* slug-aware Manage addresses link */}
            <Link
              to={addressesPath}
              className="text-[13px] font-semibold text-violet-700 hover:text-violet-800"
              onClick={onClose}
            >
              Manage addresses
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-medium"
              >
                Cancel
              </button>
              <button
                disabled={!active || saving}
                onClick={() => active && onSelect(active)}
                className={[
                  "h-10 px-4 rounded-xl text-white text-[13px] font-semibold",
                  active && !saving
                    ? "bg-violet-600 hover:bg-violet-700"
                    : "bg-slate-400 cursor-not-allowed",
                ].join(" ")}
              >
                {saving ? "Saving…" : "Deliver here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- PAGE --------------------------------- */
const AddToCart: React.FC = () => {
  const { storeSlug = "" } = useParams<{ storeSlug?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767.98px)");

  /* businessId from auth */
  const { userDetails } = (useSellerAuth() as any) ?? {};
  const businessId: string =
    userDetails?.storeLinks?.[0]?.businessId?.trim?.() ?? "";
  const skip = !businessId;

  /* live cart */
  const {
    data: cart,
    isFetching,
    refetch,
  } = useGetActiveCartQuery({ businessId }, { skip });

  const [updateItem, { isLoading: updating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: removing }] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: clearing }] = useClearCartMutation();
  const [applyCoupon, { isLoading: applying }] = useApplyCouponOnCartMutation();
  const [upsertDraft, { isLoading: drafting }] =
    useUpsertDraftFromCartMutation();

  /* addresses */
  const { data: addresses = [], isFetching: addrFetching } =
    useGetCustomerAddressesQuery(undefined, {
      skip,
    });

  /* local UI state (not persisted) */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const [addrFlash, setAddrFlash] = useState(false);
  const [note, setNote] = useState("");
  const [couponCode, setCouponCode] = useState("");

  /* prefer default address initially */
  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      if (def) setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  /* close “more” on outside click */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuBtnRef.current) return;
      const target = e.target as Node;
      const pop = document.getElementById("cart-more-popover");
      if (
        target &&
        !menuBtnRef.current.contains(target) &&
        !(pop && pop.contains(target))
      ) {
        setMenuOpen(false);
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }
    return () => {};
  }, []);

  /* derived data */
  const items = cart?.items ?? [];
  const count = useMemo(
    () => items.reduce((n, it) => n + (it.quantity || 0), 0),
    [items]
  );
  const subtotal = cart?.totals?.subtotal ?? 0;
  const discount = cart?.totals?.discount ?? 0;
  const tax = cart?.totals?.tax ?? 0;
  const grandTotal = cart?.totals?.grandTotal ?? 0;

  const STORE = {
    name: "Tech Cronet",
    logo: "https://dummyimage.com/80x80/0b0b0b/ffffff&text=TC",
  };

  /* actions */
  const bumpQty = async (item: CartItem, delta: 1 | -1) => {
    const next = Math.max(1, (item.quantity || 1) + (delta === -1 ? -1 : 1));
    await updateItem({
      itemId: item.id,
      businessId,
      quantity: next,
    });
    refetch();
  };

  const removeOne = async (item: CartItem) => {
    await removeItem({ itemId: item.id, businessId });
    refetch();
  };

  const doClearCart = async () => {
    await clearCart({ businessId });
    setConfirmOpen(false);
    refetch();
  };

  const doApplyCoupon = async () => {
    if (!couponCode.trim() || !cart?.id) return;
    await applyCoupon({ cartId: cart.id, businessId, code: couponCode.trim() });
    setCouponCode("");
    refetch();
  };

  const goBack = () => navigate(-1);

  // Persist selection immediately when user presses "Deliver here"
  const persistAddressSelection = async (addressId: string) => {
    if (!cart?.id) return;
    try {
      await upsertDraft({
        cartId: cart.id,
        businessId,
        shippingAddressId: addressId,
        billingAddressId: addressId,
      }).unwrap();
    } catch (err) {
      console.error("Failed saving address to draft:", err);
      alert("Could not save the address. Please try again.");
      throw err;
    }
  };

  const goCheckout = async () => {
    if (!selectedAddressId) {
      setPickerOpen(true);
      setAddrFlash(true);
      setTimeout(() => setAddrFlash(false), 1200);
      return;
    }
    if (cart?.id) {
      await upsertDraft({
        cartId: cart.id,
        businessId,
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
      }).unwrap();
    }
    navigate(`/${storeSlug}/payment`, {
      state: { from: location.pathname, note, addressId: selectedAddressId },
    });
  };

  const isEmpty = items.length === 0;
  const needsAddress = items.length > 0 && !selectedAddressId;

  /* ---- mobile spacer (for fixed bar) ---- */
  const barRef = useRef<HTMLDivElement | null>(null);
  const navWrapRef = useRef<HTMLDivElement | null>(null);
  const [barH, setBarH] = useState(0);
  const [navH, setNavH] = useState(0);
  const [pageScrollable, setPageScrollable] = useState(true);

  useEffect(() => {
    if (!isMobile || typeof window === "undefined") return;
    const measure = () => {
      if (barRef.current)
        setBarH(barRef.current.getBoundingClientRect().height);
      if (navWrapRef.current)
        setNavH(navWrapRef.current.getBoundingClientRect().height);
      const doc = document.documentElement;
      setPageScrollable(doc.scrollHeight > window.innerHeight + 1);
    };
    measure();
    const roBar = new ResizeObserver(measure);
    const roNav = new ResizeObserver(measure);
    if (barRef.current) roBar.observe(barRef.current);
    if (navWrapRef.current) roNav.observe(navWrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      roBar.disconnect();
      roNav.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  const spacerH = isMobile
    ? !isEmpty
      ? pageScrollable
        ? barH + navH
        : 12 + navH
      : 0
    : 0;
  const bottomOffset = isMobile
    ? `calc(env(safe-area-inset-bottom, 0px) + ${4 + navH}px)`
    : undefined;

  /* slug-aware addresses page path */
  const addressesPath = storeSlug
    ? `/${storeSlug}/profile/addresses`
    : "/profile/addresses";

  /* address section */
  const AddressSection = ({ compact = false }: { compact?: boolean }) => {
    const baseCard =
      "rounded-2xl bg-white shadow-sm border overflow-hidden transition";
    const borderTone = needsAddress ? "border-amber-300" : "border-slate-200";
    const bgTone = needsAddress ? "bg-amber-50/40" : "bg-white";
    const flashRing = addrFlash ? "ring-2 ring-amber-300" : "";

    const selected = addresses.find((a) => a.id === selectedAddressId) || null;

    return (
      <div className={`${baseCard} ${borderTone} ${bgTone} ${flashRing}`}>
        <div className="px-4 pt-4 pb-3">
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full text-left"
            type="button"
            aria-label="Choose address"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-[16px] font-semibold">
                    {selected
                      ? selected.label
                      : addrFetching
                      ? "Loading addresses…"
                      : "Select delivery address"}
                  </div>
                  {needsAddress ? (
                    <Pill tone="amber">Required</Pill>
                  ) : selected ? (
                    <Pill tone="emerald">Selected</Pill>
                  ) : null}
                  {!needsAddress && selected && (
                    <Pill>
                      {selected.kind === "home"
                        ? "Home"
                        : selected.kind === "work"
                        ? "Work"
                        : "Other"}
                    </Pill>
                  )}
                </div>
                <div className="text-[12px] text-slate-500 mt-1 leading-5">
                  {selected
                    ? [
                        selected.line1,
                        selected.line2,
                        selected.city,
                        selected.state,
                        selected.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    : "Choose an address for delivery"}
                </div>
                {!needsAddress && selected && (
                  <div className="mt-1">
                    <span className="text-[12px] text-violet-700 font-medium">
                      Change
                    </span>
                  </div>
                )}
              </div>

              <span
                className={[
                  "h-10 w-10 shrink-0 rounded-xl grid place-items-center border shadow-sm",
                  needsAddress
                    ? "bg-white border-slate-200 text-slate-500"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600",
                ].join(" ")}
              >
                {needsAddress ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path
                      d="M8 10l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path
                      d="M6 12l4 4 8-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </div>
          </button>

          <div className="mt-3 border-t border-slate-200 pt-3 text-[13px] text-slate-600 leading-6">
            The order delivery is managed by{" "}
            <span className="font-semibold text-slate-800">Stanlee India</span>.
            Orders are usually dispatched in{" "}
            <span className="font-semibold text-slate-800">1 day(s)</span>
          </div>

          {needsAddress && (
            <div
              className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[12px] text-amber-800"
              aria-live="polite"
            >
              Select a delivery address to continue.
            </div>
          )}
        </div>

        {!compact && <Divider className="mx-4" />}

        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[12px] text-slate-500">Total</div>
              <div className="text-[22px] font-extrabold leading-6">
                {currencyINR(grandTotal || 0)}
              </div>
            </div>
            <button
              disabled={
                drafting ||
                isFetching ||
                applying ||
                clearing ||
                updating ||
                removing
              }
              onClick={goCheckout}
              className={[
                "h-12 rounded-xl px-4 sm:px-5 text-white font-semibold shadow-sm active:scale-[0.98] transition",
                "bg-[#1677ff] hover:bg-[#1668e3]",
              ].join(" ")}
              type="button"
            >
              {drafting ? "Preparing…" : "Proceed to payment"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ----------------------------- RENDER ----------------------------- */
  return (
    <div className="min-h-[100dvh] bg-[#f6f7f9] isolate">
      {/* APP BAR */}
      <header
        className="sticky top-0 z-[2000] bg-white/90 backdrop-blur border-b border-slate-200"
        style={{ height: APP_BAR_H }}
      >
        <div className="mx-auto max-w-md px-3 py-2.5 relative">
          <div className="flex items-center gap-2">
            <IconBtn ariaLabel="Back" onClick={goBack}>
              <span className="text-xl leading-none">←</span>
            </IconBtn>

            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">Your cart</div>
              <div className="text-[12px] text-slate-500">
                {count} {count === 1 ? "item" : "items"} |{" "}
                {currencyINR(grandTotal || 0)}
              </div>
            </div>

            <IconBtn ariaLabel="Chat">
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
              >
                <path
                  d="M5 6.8A3.8 3.8 0 018.8 3h6.4A3.8 3.8 0 0119 6.8v5.4A3.8 3.8 0 0115.2 16H9.4c-.3 0 -.6.1 -.9.3L6 18.3V16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconBtn>

            {/* More (⋮) */}
            <IconBtn
              ariaLabel="More options"
              onClick={() => setMenuOpen((v) => !v)}
              ref={menuBtnRef}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
              >
                <circle cx="12" cy="5" r="1.6" fill="currentColor" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                <circle cx="12" cy="19" r="1.6" fill="currentColor" />
              </svg>
            </IconBtn>
          </div>

          {menuOpen && (
            <div
              id="cart-more-popover"
              className="absolute right-3 top-12 w-44 rounded-xl border border-slate-200 bg-white shadow-lg z-[2100] overflow-hidden"
              role="menu"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
                className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50"
                role="menuitem"
              >
                Clear cart
              </button>
            </div>
          )}
        </div>
      </header>

      {/* BODY */}
      <main className="mx-auto w-full max-w-md p-2 pb-0">
        <section className="rounded-2xl bg-white shadow-sm border border-slate-200">
          <div className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-900">
              <img
                src={STORE.logo}
                alt={STORE.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">{STORE.name}</div>
              <div className="mt-1">{/* optional pill here */}</div>
            </div>
          </div>
          <Divider />
          {isFetching ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 flex gap-3 border-t border-slate-100 first:border-t-0"
              >
                <div className="h-[84px] w-[84px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={firstMediaUrl(item)}
                    alt={item.Product?.name ?? "Product"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate">
                    {item.Product?.name ?? "Product"}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="text-[15px] font-semibold">
                      {currencyINR(item.price)}
                    </div>

                    <div className="flex items-center gap-2">
                      <QtyStepper
                        value={item.quantity}
                        onBump={(d) => bumpQty(item, d)}
                      />
                      <button
                        type="button"
                        onClick={() => removeOne(item)}
                        className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-rose-200/70 bg-white hover:bg-rose-50 text-rose-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300/60"
                        title="Remove from cart"
                        aria-label={`Remove ${item.Product?.name ?? "product"}`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-[18px] w-[18px]"
                          fill="none"
                        >
                          <path
                            d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Note (kept client-side; send with place order later if needed) */}
        {items.length > 0 && (
          <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write instructions, gifting ideas etc..."
              className="w-full resize-none h-20 p-4 rounded-2xl outline-none placeholder:text-slate-400"
            />
          </section>
        )}

        {/* Coupon */}
        {items.length > 0 && (
          <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500 text-white font-black text-[11px] tracking-wider flex items-center justify-center shadow-sm">
                DEAL
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium">Have a coupon?</div>
                <div className="text-[12px] text-slate-500">
                  Apply and refresh totals
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 h-10 px-3 rounded-xl border border-slate-300 outline-none"
              />
              <button
                disabled={!couponCode.trim() || applying || !cart?.id}
                onClick={doApplyCoupon}
                className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold disabled:opacity-60"
              >
                {applying ? "Applying…" : "Apply"}
              </button>
            </div>
          </section>
        )}

        {/* Bill details from API totals */}
        {items.length > 0 && (
          <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
            <div className="text-[16px] font-semibold">Bill Details</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-slate-700">Subtotal</span>
                <span>{currencyINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-slate-700">Discount</span>
                <span
                  className={
                    discount ? "text-emerald-700 font-medium" : "text-slate-400"
                  }
                >
                  {discount ? "– " + currencyINR(discount) : "--"}
                </span>
              </div>
              <Divider dashed />
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-slate-700">Tax</span>
                <span>{tax ? currencyINR(tax) : "—"}</span>
              </div>
              <Divider />
              <div className="flex items-center justify-between text-[15px] font-semibold">
                <span>To Pay</span>
                <span>{currencyINR(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-3">
              <button
                disabled={clearing || items.length === 0}
                onClick={() => setConfirmOpen(true)}
                className="text-[13px] font-semibold text-rose-600 hover:text-rose-700"
              >
                {clearing ? "Clearing…" : "Clear cart"}
              </button>
            </div>
          </section>
        )}

        {/* DESKTOP (md+) in-flow Address + Payment section */}
        {items.length > 0 && (
          <section className="hidden md:block mt-6">
            <div className="max-w-md mx-auto">
              <AddressSection />
            </div>
          </section>
        )}

        {/* MOBILE spacer (only needed when fixed) */}
        {items.length > 0 && isMobile && <div style={{ height: spacerH }} />}
      </main>

      {/* MOBILE fixed Address + Payment card above BottomNav */}
      {items.length > 0 && isMobile && (
        <div
          ref={barRef}
          className={[
            "fixed left-1/2 -translate-x-1/2 md:hidden",
            "w-[calc(100%-24px)] max-w-md",
            "z-[5000]",
          ].join(" ")}
          style={{ bottom: bottomOffset }}
        >
          <AddressSection compact />
        </div>
      )}

      {/* Bottom Navigation (measured for spacer) */}
      <div ref={navWrapRef}>
        <BottomNav />
      </div>

      {/* Clear cart confirmation modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Clear cart?"
        message="This will remove all items from your cart."
        confirmText="Yes, clear"
        cancelText="Cancel"
        onConfirm={doClearCart}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Address picker modal */}
      <AddressPicker
        open={pickerOpen}
        addresses={addresses}
        selectedId={selectedAddressId}
        saving={drafting}
        addressesPath={addressesPath} // << slug-aware link
        onClose={() => setPickerOpen(false)}
        onSelect={async (id) => {
          await persistAddressSelection(id); // persist first to server draft
          setSelectedAddressId(id); // then update UI
          setPickerOpen(false);
        }}
      />
    </div>
  );
};

export default AddToCart;

/* --------------------------- Confirm Modal --------------------------- */
type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", onKey);
    setTimeout(() => confirmRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[6000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative mx-3 w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="px-4 pt-4 pb-2">
          <div className="text-[15px] font-semibold">{title}</div>
          <div className="mt-2 text-[13px] text-slate-600">{message}</div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-medium"
            type="button"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="h-9 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold shadow-sm"
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
