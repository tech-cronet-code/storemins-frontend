/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Bottom “Your cart (N)” dock — ephemerally shows after add, hides after a delay. */
type Props = {
  checkoutPath?: string;
  /** How long to keep the dock visible after an add (ms). Default: 10s */
  showMs?: number;
  /** If true, the dock sticks around whenever the cart is non-empty (not desired for toast UX). */
  stickWhileNotEmpty?: boolean;
  /** Count mode: 'unique' = distinct products (default), 'qty' = sum of quantities */
  countMode?: "unique" | "qty";
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
  showMs = 10000, // 10s default
  stickWhileNotEmpty = false, // toast-style by default
  countMode = "unique",
}) => {
  const nav = useNavigate();
  const loc = useLocation();

  const initialCount = computeCount(safeParseCart(), countMode);
  const [count, setCount] = useState<number>(initialCount);
  // For a toast UX, start hidden; we only show on "add" or count increase.
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
      // Classic sticky dock: always visible if non-empty
      setVisible(c > 0);
      if (!c) hide();
    } else {
      // Toast logic: pop only on add (or explicit flash)
      if (forceFlash || c > prev) {
        // If count increased or user dispatched `cart:add`, show and reset timer
        showFor();
      }
      // If cart emptied, hide immediately
      if (c === 0) hide();
    }

    lastCountRef.current = c;
  };

  useEffect(() => {
    // Initial read (no flash)
    refresh(false);

    const onAdd = () => refresh(true); // explicit add signal -> flash
    const onUpdate = () => refresh(false); // generic updates -> auto flash on increase
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

  // Don’t render if cart is empty and we’re not in sticky mode
  if (!count && !stickWhileNotEmpty) return null;

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 z-[80]",
        "bottom-3 sm:bottom-5",
        "transition-all duration-250",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-live="polite"
    >
      <button
        onClick={() => nav(derivedCheckout)}
        className={[
          "px-5 sm:px-6 py-2.5 sm:py-3 rounded-full",
          "bg-fuchsia-600 hover:bg-fuchsia-700 text-white",
          "font-semibold shadow-lg shadow-fuchsia-600/30",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        ].join(" ")}
        aria-label={`Open your cart with ${count} item${count > 1 ? "s" : ""}`}
        type="button"
      >
        Your cart ({count})
      </button>
    </div>
  );
};

export default CartDock;
