import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

/* ============================================================================
   Responsive AddToCart
   - Mobile (< md): fixed Address/Payment card above BottomNav with smart spacer
   - Desktop (md+): in-flow Address/Payment section (no stickiness)
   ============================================================================ */

type CartItem = {
  id: string;
  title: string;
  variant?: string;
  price: number; // rupees each
  qty: number;
  image: string;
};

const APP_BAR_H = 56; // header height

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

const IconBtn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { ariaLabel?: string }
> = ({ className, ariaLabel, children, ...props }) => (
  <button
    aria-label={ariaLabel}
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
);

const StarSellerPill: React.FC = () => (
  <span
    className={[
      "inline-flex items-center gap-1.5 rounded-full",
      "px-2.5 py-[3px] text-[11px] font-medium",
      "border border-emerald-200 text-emerald-700",
      "bg-[rgb(232,247,238)] shadow-[0_0_0_1px_rgba(16,185,129,0.04),0_1px_2px_0_rgba(16,185,129,0.10)]",
    ].join(" ")}
  >
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
    <span>Star Seller on</span>
    <span className="font-semibold">minis</span>
  </span>
);

/* ---- TS-safe media query hook ---- */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mql.matches);

    // Modern browsers
    mql.addEventListener?.("change", handler);
    // Legacy Safari fallback (deprecated API)
    (mql as any).addListener?.(handler);

    return () => {
      mql.removeEventListener?.("change", handler);
      (mql as any).removeListener?.(handler);
    };
  }, [query]);

  return matches;
}

type CartItemT = CartItem;

const AddToCart: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767.98px)"); // Tailwind md breakpoint

  const STORE = {
    name: "Stanlee India",
    logo: "https://dummyimage.com/80x80/0b0b0b/ffffff&text=S",
  };

  const [items, setItems] = useState<CartItemT[]>([
    {
      id: "stb-stand",
      title: "Stanlee India Set top Box Stand D-ST333",
      variant: "Grey · Standard",
      price: 599,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1614680376739-414d95ff43df?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "wall-shelf",
      title: "Minimal Floating Wall Shelf",
      variant: "Matte Black · 24 inch",
      price: 1299,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "table-lamp",
      title: "Nordic Bedside Table Lamp",
      variant: "Warm White · Fabric Shade",
      price: 1899,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "frame-set",
      title: "Photo Frame Set (Pack of 3)",
      variant: "Walnut · A4",
      price: 899,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "planter",
      title: "Ceramic Desk Planter",
      variant: "Off-white · 12cm",
      price: 499,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "clock",
      title: "Modern Wall Clock",
      variant: "Brushed Gold · 12 inch",
      price: 1599,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=600&auto=format&fit=crop",
    },
  ]);

  const [note, setNote] = useState("");

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const deliveryFee = 0;
  const toPay = subtotal + deliveryFee;

  const dec = (id: string) =>
    setItems((p) =>
      p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
    );
  const inc = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const goBack = () => navigate(-1);
  const applyCoupon = () => alert("Coupon flow (demo)");
  const goCheckout = () => navigate("/checkout");

  const isEmpty = items.length === 0;

  /* ------------------- MOBILE ONLY: measure fixed bar + bottom nav ------------------- */
  const barRef = useRef<HTMLDivElement | null>(null);
  const navWrapRef = useRef<HTMLDivElement | null>(null);
  const [barH, setBarH] = useState(0);
  const [navH, setNavH] = useState(0);
  const [pageScrollable, setPageScrollable] = useState(true);

  useEffect(() => {
    if (!isMobile) return; // only measure on mobile
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

  return (
    <div className="min-h-[100dvh] bg-[#f6f7f9] isolate">
      {/* APP BAR */}
      <header
        className="sticky top-0 z-[2000] bg-white/90 backdrop-blur border-b border-slate-200"
        style={{ height: APP_BAR_H }}
      >
        <div className="mx-auto max-w-md px-3 py-2.5">
          <div className="flex items-center gap-2">
            <IconBtn ariaLabel="Back" onClick={goBack}>
              <span className="text-xl leading-none">←</span>
            </IconBtn>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">Your cart</div>
              <div className="text-[12px] text-slate-500">
                {count} {count === 1 ? "item" : "items"} |{" "}
                {currencyINR(subtotal)}
              </div>
            </div>
            <IconBtn ariaLabel="Chat">
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
              >
                <path
                  d="M5 6.8A3.8 3.8 0 018.8 3h6.4A3.8 3.8 0 0119 6.8v5.4A3.8 3.8 0 0115.2 16H9.4c-.3 0-.6.1-.9.3L6 18.3V16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconBtn>
            <IconBtn ariaLabel="More options">
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
        </div>
      </header>

      {/* BODY */}
      <main className="mx-auto w-full max-w-md p-2 pb-0">
        {/* Store card */}
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
              <div className="mt-1">
                <StarSellerPill />
              </div>
            </div>
          </div>
          <Divider />
          {isEmpty ? (
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
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate">
                    {item.title}
                  </div>
                  {item.variant && (
                    <div className="text-[12px] text-slate-500 mt-0.5 truncate">
                      {item.variant}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-[15px] font-semibold">
                      {currencyINR(item.price)}
                    </div>
                    <div className="inline-flex items-center rounded-xl border border-slate-300 overflow-hidden bg-white">
                      <button
                        onClick={() => dec(item.id)}
                        className="px-3 py-1.5 hover:bg-slate-50"
                        aria-label="Decrease"
                      >
                        –
                      </button>
                      <div className="w-8 text-center text-[14px] select-none">
                        {item.qty}
                      </div>
                      <button
                        onClick={() => inc(item.id)}
                        className="px-3 py-1.5 hover:bg-slate-50"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Note */}
        {!isEmpty && (
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
        {!isEmpty && (
          <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500 text-white font-black text-[11px] tracking-wider flex items-center justify-center shadow-sm">
                FOR
                <br />
                YOU
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium">
                  Save ₹12 off on this order
                </div>
                <div className="text-[12px] text-slate-500">
                  Use code: <span className="font-semibold">DAZZLEMINI</span>
                </div>
              </div>
              <button
                onClick={applyCoupon}
                className="text-[13px] font-semibold text-rose-500 hover:text-rose-600"
              >
                Apply
              </button>
            </div>
          </section>
        )}

        {/* Bill details */}
        {!isEmpty && (
          <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
            <div className="text-[16px] font-semibold">Bill Details</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-slate-700">Subtotal</span>
                <span>{currencyINR(subtotal)}</span>
              </div>
              <Divider dashed />
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-slate-700">Delivery Fee</span>
                <span className="text-slate-400">--</span>
              </div>
              <Divider />
              <div className="flex items-center justify-between text-[15px] font-semibold">
                <span>To Pay</span>
                <span>{currencyINR(toPay)}</span>
              </div>
            </div>
          </section>
        )}

        {/* Cancellation Policy */}
        {!isEmpty && (
          <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
            <div className="text-[16px] font-semibold text-slate-900">
              Cancellation Policy
            </div>
            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span>
                  Full refund if you cancel it before the order is accepted by
                  us. For any queries on cancellations reach out to us via chat.
                </span>
              </li>
            </ul>
          </section>
        )}

        {/* DESKTOP (md+) in-flow Address + Payment section */}
        {!isEmpty && (
          <section className="hidden md:block mt-6">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden max-w-md mx-auto">
              {/* Address */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-semibold">
                      Home Raj Nagar
                    </div>
                    <div className="text-[12px] text-slate-500 mt-1 leading-5">
                      a-1301, Raj Nagar Extension, Ghaziabad, Uttar Pradesh
                      201017
                    </div>
                  </div>
                  <button
                    className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center justify-center"
                    aria-label="Select address"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                    >
                      <path
                        d="M6 12l4 4 8-8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-3 text-[13px] text-slate-600 leading-6">
                  The order delivery is managed by{" "}
                  <span className="font-semibold text-slate-800">
                    Stanlee India
                  </span>
                  . Orders are usually dispatched in{" "}
                  <span className="font-semibold text-slate-800">1 day(s)</span>
                </div>
              </div>

              <Divider className="mx-4" />

              {/* Payment */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-[12px] text-slate-500">Total</div>
                    <div className="text-[22px] font-extrabold leading-6">
                      {currencyINR(toPay)}
                    </div>
                  </div>
                  <button
                    onClick={goCheckout}
                    className="h-12 rounded-xl px-4 sm:px-5 text-white font-semibold bg-[#1677ff] hover:bg-[#1668e3] shadow-sm active:scale-[0.98] transition"
                  >
                    Proceed to payment
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MOBILE spacer (only needed when fixed) */}
        {!isEmpty && isMobile && <div style={{ height: spacerH }} />}
      </main>

      {/* MOBILE (<md) fixed Address + Payment card above BottomNav */}
      {!isEmpty && isMobile && (
        <div
          ref={barRef}
          className={[
            "fixed left-1/2 -translate-x-1/2 md:hidden",
            "w-[calc(100%-24px)] max-w-md",
            "rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden",
            "z-[5000]",
          ].join(" ")}
          style={{ bottom: bottomOffset }}
        >
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-semibold">Home Raj Nagar</div>
                <div className="text-[12px] text-slate-500 mt-1 leading-5">
                  a-1301, Raj Nagar Extension, Ghaziabad, Uttar Pradesh 201017
                </div>
              </div>
              <button
                className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center justify-center"
                aria-label="Select address"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-sky-600"
                  fill="none"
                >
                  <path
                    d="M6 12l4 4 8-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-3 border-t border-slate-200 pt-3 text-[13px] text-slate-600 leading-6">
              The order delivery is managed by{" "}
              <span className="font-semibold text-slate-800">
                Stanlee India
              </span>
              . Orders are usually dispatched in{" "}
              <span className="font-semibold text-slate-800">1 day(s)</span>
            </div>
          </div>

          <Divider className="mx-4" />

          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-[12px] text-slate-500">Total</div>
                <div className="text-[22px] font-extrabold leading-6">
                  {currencyINR(toPay)}
                </div>
              </div>
              <button
                onClick={goCheckout}
                className="h-12 rounded-xl px-4 sm:px-5 text-white font-semibold bg-[#1677ff] hover:bg-[#1668e3] shadow-sm active:scale-[0.98] transition"
              >
                Proceed to payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (wrapped so we can measure height on mobile) */}
      <div ref={navWrapRef}>
        <BottomNav />
      </div>
    </div>
  );
};

export default AddToCart;
