import React, { useLayoutEffect, useRef, useState } from "react";
import cn from "classnames";

/** ---------------- Types ---------------- */
export type StoreStatsSettings = {
  // display
  alignment?: "left" | "center" | "right";
  compact?: boolean;
  show_dividers?: boolean;
  text_color?: string;
  divider_color?: string;
  visibility?: "all" | "desktop" | "mobile";

  // optional font control (not in schema but supported)
  font_size_px?: number;

  // built-in badges
  rating_enabled?: boolean;
  rating_value?: number;
  rating_count?: number;

  orders_enabled?: boolean;
  orders_value?: string;

  loves_enabled?: boolean;
  loves_value?: number;

  // custom badges
  custom1_enabled?: boolean;
  custom1_icon?: string;
  custom1_label?: string;
  custom1_value?: string;

  custom2_enabled?: boolean;
  custom2_icon?: string;
  custom2_label?: string;
  custom2_value?: string;

  // advanced
  custom_css?: string | null;
};

export const defaultStoreStatsSettings: StoreStatsSettings = {
  alignment: "center",
  compact: true,
  show_dividers: true,
  text_color: "#111827",
  divider_color: "#E5E7EB",
  visibility: "all",

  rating_enabled: true,
  rating_value: 4.42,
  rating_count: 92,

  orders_enabled: true,
  orders_value: "1.5k",

  loves_enabled: true,
  loves_value: 279,

  custom1_enabled: false,
  custom1_icon: "ri-flashlight-line",
  custom1_label: "New",
  custom1_value: "",

  custom2_enabled: false,
  custom2_icon: "ri-shield-check-line",
  custom2_label: "Trusted",
  custom2_value: "",

  custom_css: null,
};

/* ---------- Fit-to-width hook (keeps one line, as big as possible) ---------- */
function useFitRow(minScale = 0.86, maxScale = 1) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const calc = () => {
      const natural = inner.scrollWidth;
      const avail = outer.clientWidth;
      if (!natural || !avail) return;
      const needed = Math.min(
        maxScale,
        Math.max(minScale, Math.min(1, (avail - 2) / natural))
      );
      setScale(needed);
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(outer);
    ro.observe(inner);
    window.addEventListener("orientationchange", calc);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", calc);
      window.removeEventListener("resize", calc);
    };
  }, [minScale, maxScale]);

  return { outerRef, innerRef, scale };
}

/* ---------- Icons scale with text (use em) ---------- */
const I = {
  star: () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#F59E0B"
        d="M12 2l2.95 6 6.6.9-4.78 4.6L18 21l-6-3.2L6 21l1.23-7.5L2.45 8.9l6.6-.9L12 2z"
      />
    </svg>
  ),
  bag: () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#7C3AED"
        d="M6 7h12l1 13H5L6 7zm3-2a3 3 0 016 0h-2a1 1 0 10-2 0H9z"
      />
    </svg>
  ),
  heart: () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#DC2626"
        d="M12 21s-7.5-4.35-9.5-8.1C.9 9.38 2.5 6 6 6c2 0 3.2 1.1 4 2 0 0 1-2 4-2 3.5 0 5.1 3.38 3.5 6.9C19.5 16.65 12 21 12 21z"
      />
    </svg>
  ),
  dot: () => (
    <svg width="0.7em" height="0.7em" viewBox="0 0 8 8" aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="#111827" />
    </svg>
  ),
};

const Divider: React.FC<{ color?: string }> = ({ color }) => (
  <span
    aria-hidden="true"
    className="hidden md:block h-5 w-px"
    style={{ backgroundColor: color || "#E5E7EB" }}
  />
);

/* ---------- Metrics source (safe) ---------- */
function useMetrics(s: StoreStatsSettings) {
  const fallback = {
    rating_value: s.rating_value ?? 4.42,
    rating_count: s.rating_count ?? 92,
    orders_value: s.orders_value ?? "1.5k",
    loves_value: s.loves_value ?? 279,
  } as const;

  try {
    const w = typeof window !== "undefined" ? (window as any) : {};
    const m = w.__STORE_STATS || (s as any).metrics || {};
    return { ...fallback, ...m };
  } catch {
    return fallback;
  }
}

/* ---------- Component ---------- */
export const StoreStatsBlock: React.FC<{
  settings?: Partial<StoreStatsSettings>;
}> = ({ settings = {} }) => {
  const s: StoreStatsSettings = {
    ...defaultStoreStatsSettings,
    ...(settings || {}),
  };
  const m = useMetrics(s);

  const items: Array<{ key: string; icon: React.ReactNode; label: string }> =
    [];

  if (s.rating_enabled) {
    const rv = Number(m.rating_value ?? 0);
    const rc = Number(m.rating_count ?? 0);
    items.push({
      key: "rating",
      icon: <I.star />,
      label: `${rv.toFixed(2)} (${rc}) Rating`,
    });
  }
  if (s.orders_enabled) {
    items.push({
      key: "orders",
      icon: <I.bag />,
      label: `${m.orders_value ?? ""} Orders`,
    });
  }
  if (s.loves_enabled) {
    items.push({
      key: "loves",
      icon: <I.heart />,
      label: `${m.loves_value ?? 0} Follow`,
    });
  }

  // Up to 2 custom badges
  const pushCustom = (idx: 1 | 2) => {
    if (!s[`custom${idx}_enabled`]) return;
    const iconClass = s[`custom${idx}_icon`];
    const label = s[`custom${idx}_label`] || "Custom";
    const value = s[`custom${idx}_value`] || "";
    items.push({
      key: `custom${idx}`,
      icon: iconClass ? (
        <i className={cn(iconClass)} aria-hidden="true" />
      ) : (
        <I.dot />
      ),
      label: value ? `${value} ${label}` : label,
    });
  };
  pushCustom(1);
  pushCustom(2);

  if (!items.length) return null;

  const align =
    s.alignment === "left"
      ? "justify-start"
      : s.alignment === "right"
      ? "justify-end"
      : "justify-center";

  const baseFont = s.font_size_px
    ? `${s.font_size_px}px`
    : "clamp(13px, 1.2vw + 0.4rem, 16px)";

  const { outerRef, innerRef, scale } = useFitRow(0.86, 1);

  return (
    <section
      className={cn(
        "w-full",
        s.visibility === "desktop" ? "hidden md:block" : "",
        s.visibility === "mobile" ? "md:hidden" : ""
      )}
      ref={outerRef}
    >
      <div
        className={cn("flex items-center px-4 py-3", align)}
        style={{ fontSize: baseFont, lineHeight: 1.2, overflow: "hidden" }}
      >
        <div
          ref={innerRef}
          className={cn(
            "flex items-center whitespace-nowrap",
            s.compact ? "gap-3 md:gap-8" : "gap-4 md:gap-10"
          )}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
            willChange: "transform",
          }}
        >
          {items.slice(0, 5).map((it, i) => (
            <div key={it.key} className="flex items-center">
              {i > 0 && s.show_dividers ? (
                <Divider color={s.divider_color} />
              ) : null}

              <div
                className="flex items-center mx-2 md:mx-4 gap-1.5 md:gap-2"
                style={{ color: s.text_color || "#111827" }}
              >
                {typeof it.icon === "object" &&
                (it.icon as any)?.type === "i" ? (
                  <i
                    className={cn(
                      (it.icon as any).props.className,
                      "text-[1em] md:text-[1.1em]"
                    )}
                    aria-hidden="true"
                  />
                ) : (
                  it.icon
                )}
                <span className="font-medium">{it.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </section>
  );
};
