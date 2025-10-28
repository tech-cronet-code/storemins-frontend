import React, { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

/* ---------------------------------
   Settings type & defaults (server)
   --------------------------------- */

export type StoreDeliveryInfoSettings = {
  background_color?: string;
  text_color?: string;
  accent_color?: string;
  align?: "left" | "center" | "right";
  show_dividers?: boolean;
  min_days?: number;
  max_days?: number;
  store_name?: string;
  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";

  // optional badge overrides
  badge_trusted_url?: string;
  badge_easy_returns_url?: string;
};

const DEFAULTS: Required<
  Omit<
    StoreDeliveryInfoSettings,
    "custom_css" | "badge_trusted_url" | "badge_easy_returns_url"
  >
> & {
  custom_css: string | null;
  badge_trusted_url?: string;
  badge_easy_returns_url?: string;
} = {
  background_color: "#ffffff",
  text_color: "#111827",
  accent_color: "#7c3aed",
  align: "left",
  show_dividers: true,
  min_days: 1,
  max_days: 5,
  store_name: "",
  custom_css: null,
  visibility: "all",
  badge_trusted_url: undefined,
  badge_easy_returns_url: undefined,
};

/* ------------- helpers ------------- */
const vis = (v: "all" | "desktop" | "mobile" = "all") =>
  v === "desktop" ? "hidden md:block" : v === "mobile" ? "block md:hidden" : "";

const clampInt = (v: any, lo: number, hi: number, d: number) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, lo), hi) : d;
};

const PinIcon = ({
  className,
  color = "#7c3aed",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    className={className}
    aria-hidden="true"
  >
    <path
      fill={color}
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 10.5A3.5 3.5 0 1 1 12 5.5a3.5 3.5 0 0 1 0 7Z"
    />
  </svg>
);

function SimpleBadge({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="h-8 w-8 object-contain"
          loading="lazy"
        />
      </div>
      <span className="text-[11px] text-slate-600">{label}</span>
    </div>
  );
}

/* ----------------- Modal ----------------- */
function Modal({
  open,
  onClose,
  onApply,
  accent = "#7c3aed",
}: {
  open: boolean;
  onClose: () => void;
  onApply: (pin: string) => void;
  accent?: string;
}) {
  const [pin, setPin] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = /^\d{5,6}$/.test((pin || "").trim());

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const apply = () => {
    if (valid) onApply(pin.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pincode_title"
    >
      <div
        className="w-full max-w-sm rounded-md bg-white shadow-lg p-5"
        onMouseDown={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-md bg-slate-100 flex items-center justify-center">
            <PinIcon color={accent} />
          </div>
          <div>
            <h2
              id="pincode_title"
              className="text-lg font-semibold text-slate-900"
            >
              Enter pincode
            </h2>
            <p className="text-slate-500 -mt-0.5">
              to view delivery information
            </p>
          </div>
        </div>
        <input
          id="pincode_input"
          ref={inputRef}
          className={cn(
            "w-full rounded-md px-4 py-3 text-[15px] outline-none",
            "border transition-colors",
            valid
              ? "border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/40"
              : "border-slate-300 focus:ring-2 focus:ring-slate-200"
          )}
          placeholder="Pincode"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        {!valid && touched && (
          <p className="mt-2 text-xs text-slate-500">
            Enter a valid 5–6 digit code.
          </p>
        )}
        <button
          onClick={apply}
          disabled={!valid}
          className="mt-4 w-full rounded-md px-4 py-3 text-[15px] font-semibold text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: valid ? accent : "#9ca3af" }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/* ----------------- Main Block ----------------- */
export const StoreDeliveryInfoBlock: React.FC<{
  settings?: Partial<StoreDeliveryInfoSettings>;
}> = ({ settings }) => {
  const s: StoreDeliveryInfoSettings = { ...DEFAULTS, ...(settings || {}) };

  const accent = s.accent_color || "#7c3aed";
  const textColor = s.text_color || "#111827";
  const visibility = s.visibility || "all";

  const TRUSTED_BADGE =
    s.badge_trusted_url ||
    "https://www.shutterstock.com/image-vector/trusted-seller-gold-medal-emblem-260nw-2492358241.jpg";
  const EASY_RETURNS_BADGE =
    s.badge_easy_returns_url ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThhZlnFrvQv8xghKqPAxtwQZ605atofsQjSQ&s";

  const storeName =
    s.store_name ||
    (typeof window !== "undefined" && (window as any).__STORE_NAME) ||
    "Your Store";

  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("delivery_info") || "{}");
      if (saved.pin) setPin(saved.pin);
      if (saved.days) setDays(saved.days);
    } catch {
      /* empty */
    }
  }, []);

  const minDays = clampInt(s.min_days, 1, 10, 1);
  const maxDays = Math.max(minDays, clampInt(s.max_days, 1, 30, 5));

  const handleApply = (p: string) => {
    const base = p.split("").reduce((a, c) => a + (c.charCodeAt(0) % 10), 0);
    const range = maxDays - minDays + 1;
    const d = minDays + (base % range);
    setPin(p);
    setDays(d);
    try {
      localStorage.setItem(
        "delivery_info",
        JSON.stringify({ pin: p, days: d })
      );
    } catch {
      /* empty */
    }
    setOpen(false);
  };

  const leftText = useMemo(() => {
    if (!pin || !days) return `Direct delivery by ${storeName}`;
    return `${storeName} delivers in ${days} ${days > 1 ? "days" : "day"}`;
  }, [pin, days, storeName]);

  const rowClass = cn("w-full", vis(visibility));

  return (
    <>
      <div
        className={cn(
          rowClass,
          "max-w-full bg-white border-t border-b border-slate-200"
        )}
        style={{ color: textColor, backgroundColor: s.background_color }}
      >
        {/* top divider */}
        {s.show_dividers && (
          <div className="h-px w-full bg-slate-200" aria-hidden="true" />
        )}

        <div className="px-4 md:px-6 py-4 md:py-5 w-full max-w-full">
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              s.align === "left"
                ? "justify-between"
                : s.align === "center"
                ? "justify-center"
                : "justify-between"
            )}
          >
            {/* LEFT */}
            <div className="flex items-start gap-3 min-w-0 pr-3 max-w-[50%]">
              <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <PinIcon color={accent} />
              </div>
              <div className="min-w-0">
                <div className="text-sm md:text-base font-medium text-slate-900 truncate">
                  {leftText}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-sm md:text-base font-semibold hover:underline focus:outline-none w-fit truncate"
                  style={{ color: accent }}
                >
                  Get delivery information <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 md:gap-5 shrink-0 pl-3 max-w-[50%]">
              <SimpleBadge
                src={EASY_RETURNS_BADGE}
                alt="Easy Returns badge"
                label="Easy Returns"
              />
              <SimpleBadge
                src={TRUSTED_BADGE}
                alt="Trusted Seller badge"
                label="Trusted Seller"
              />
            </div>
          </div>
        </div>

        {/* bottom divider */}
        {s.show_dividers && (
          <div className="h-px w-full bg-slate-200" aria-hidden="true" />
        )}
      </div>

      {s.custom_css ? <style>{s.custom_css}</style> : null}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onApply={handleApply}
        accent={accent}
      />
    </>
  );
};
