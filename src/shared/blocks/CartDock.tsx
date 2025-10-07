/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

/** Bottom “Your cart (N)” dock — mobile-safe */
type Props = {
  checkoutPath?: string;
  /** How long to keep the dock visible after an add (ms). Default: 10s */
  showMs?: number;
  /** If true, the dock sticks around whenever the cart is non-empty. */
  stickWhileNotEmpty?: boolean;
  /** Count mode: 'unique' = distinct products (default), 'qty' = sum of quantities */
  countMode?: "unique" | "qty";
  /** Extra pixels to lift above another fixed bar (e.g. bottom nav). */
  bottomOffsetPx?: number; // ← new, defaults to 0
  /** z-index override (in case you have other fixed layers). */
  zIndex?: number; // ← new, defaults to 5000
};

type CartItem = { id?: string | number; qty?: number };

function safeParseCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart");
    const arr = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function computeCount(items: CartItem[], mode: Props["countMode"] = "unique") {
  if (mode === "qty") {
    return items.reduce((sum, it) => sum + (Number(it?.qty) || 1), 0);
  }
  const ids = new Set(items.map((it) => String(it?.id ?? ""))).size;
  return ids || items.length;
}

const CartDock: React.FC<Props> = ({
  checkoutPath,
  showMs = 10000,
  stickWhileNotEmpty = false,
  countMode = "unique",
  bottomOffsetPx = 0,
  zIndex = 5000,
}) => {
  const nav = useNavigate();
  const loc = useLocation();

  const initialCount = computeCount(safeParseCart(), countMode);
  const [count, setCount] = useState<number>(initialCount);

  // Toast UX: start hidden; only flash on add or count increase.
  const [visible, setVisible] = useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const lastCountRef = useRef<number>(initialCount);

  const derivedCheckout = useMemo(() => {
    if (checkoutPath) return checkoutPath;
    const parts = loc.pathname.split("/").filter(Boolean);
    const first = parts[0] || "";
    return first ? `/${first}/checkout` : "/checkout";
  }, [checkoutPath, loc.pathname]);

  const hide = () => {
    setVisible(false);
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const showFor = (ms = showMs) => {
    setVisible(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setVisible(false);
      timer.current = null;
    }, ms);
  };

  /** Recompute count from storage; show if needed. */
  const refresh = (forceFlash = false) => {
    const items = safeParseCart();
    const c = computeCount(items, countMode);
    const prev = lastCountRef.current;

    setCount(c);

    if (stickWhileNotEmpty) {
      setVisible(c > 0);
      if (!c) hide();
    } else {
      if (forceFlash || c > prev) showFor();
      if (c === 0) hide();
    }

    lastCountRef.current = c;
  };

  useEffect(() => {
    // Initial read (no flash)
    refresh(false);

    const onAdd = () => refresh(true);
    const onUpdate = () => refresh(false);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") refresh(false);
    };

    window.addEventListener("cart:add", onAdd as EventListener);
    window.addEventListener("cart:update", onUpdate as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart:add", onAdd as EventListener);
      window.removeEventListener("cart:update", onUpdate as EventListener);
      window.removeEventListener("storage", onStorage);
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countMode, showMs, stickWhileNotEmpty]);

  // Don’t render at all if cart is empty and we’re not sticky
  if (!count && !stickWhileNotEmpty) return null;

  // Render in a portal so it’s never clipped by parents
  const node = (
    <div
      className={[
        // Full-width lane with centered content (better for tiny phones)
        "fixed inset-x-0",
        "flex justify-center",
        "pointer-events-none", // container doesn't capture taps; inner wrapper does
        "transition-transform transition-opacity duration-300",
      ].join(" ")}
      style={{
        zIndex,
        bottom: `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom))`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
      aria-live="polite"
    >
      {/* Inner wrapper: responsive sizing */}
      <div
        className={[
          // Mobile: stretch nicely with side gutters
          "w-[92%] max-w-[520px] sm:w-auto sm:max-w-none",
          "pointer-events-auto", // allow clicks
        ].join(" ")}
      >
        <button
          onClick={() => nav(derivedCheckout)}
          className={[
            "w-full sm:w-auto",
            "px-4 sm:px-6 py-3 rounded-full",
            "bg-fuchsia-600 hover:bg-fuchsia-700 text-white",
            "font-semibold shadow-lg shadow-fuchsia-600/30",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          ].join(" ")}
          aria-label={`Open your cart with ${count} item${
            count > 1 ? "s" : ""
          }`}
          type="button"
        >
          Your cart ({count})
        </button>
      </div>
    </div>
  );

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  return portalTarget ? ReactDOM.createPortal(node, portalTarget) : node;
};

export default CartDock;
