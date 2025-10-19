/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

/* ==== NEW ==== */
import { useAuth } from "../../modules/auth/contexts/AuthContext";
import { useGetActiveCartQuery } from "../../modules/customer/services/customerCartApi";

type Props = {
  checkoutPath?: string;
  showMs?: number;
  stickWhileNotEmpty?: boolean;
  countMode?: "unique" | "qty";
  bottomOffsetPx?: number;
  zIndex?: number;
};

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

  const { userDetails } = (useAuth() as any) ?? {};
  const businessId: string =
    userDetails?.storeLinks?.[0]?.businessId?.trim?.() ?? "";

  // Pull live cart
  const { data: cart, refetch } = useGetActiveCartQuery(
    { businessId },
    { skip: !businessId }
  );

  const apiCount = useMemo(() => {
    if (!cart) return 0;
    if (countMode === "qty")
      return cart.items.reduce((n, i) => n + (Number(i.quantity) || 0), 0);
    // unique
    return new Set(
      cart.items.map((i) => i.productId + ":" + (i.variantId ?? ""))
    ).size;
  }, [cart, countMode]);

  const [count, setCount] = useState<number>(apiCount);
  const [visible, setVisible] = useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const lastCountRef = useRef<number>(apiCount);

  useEffect(() => {
    setCount(apiCount);
    lastCountRef.current = apiCount;
    if (stickWhileNotEmpty) setVisible(apiCount > 0);
  }, [apiCount, stickWhileNotEmpty]);

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

  // Flash on add events and storage signals, then refetch
  useEffect(() => {
    const onAdd = () => {
      refetch();
      showFor();
    };
    const onUpdate = () => {
      refetch();
      if (!stickWhileNotEmpty) showFor();
    };
    window.addEventListener("cart:add", onAdd as EventListener);
    window.addEventListener("cart:update", onUpdate as EventListener);
    return () => {
      window.removeEventListener("cart:add", onAdd as EventListener);
      window.removeEventListener("cart:update", onUpdate as EventListener);
    };
  }, [refetch, stickWhileNotEmpty, showMs]);

  if (!count && !stickWhileNotEmpty) return null;

  const node = (
    <div
      className={[
        "fixed inset-x-0",
        "flex justify-center",
        "pointer-events-none",
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
      <div
        className={[
          "w-[92%] max-w-[520px] sm:w-auto sm:max-w-none",
          "pointer-events-auto",
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
