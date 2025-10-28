// client/src/shared/blocks/MainCoupon.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import clsx from "clsx";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type CouponItem = {
  enabled?: boolean;
  badge_text?: string;
  badge_bg?: string;
  badge_color?: string;
  title?: string;
  subtitle?: string;
  href?: string;
};

export type MainCouponSettings = {
  enabled?: boolean;

  // header
  display_title?: boolean;
  title?: string;
  title_color?: string;
  align?: "left" | "center" | "right";

  // items
  items?: CouponItem[];

  // card UI
  card_radius?: number;
  card_border?: boolean;
  card_border_color?: string;
  card_text_color?: string;
  card_subtle_text_color?: string;
  card_bg?: string;
  card_shadow?: boolean;
  card_height_px?: number;
  card_horizontal_pad_px?: number;
  gap_px?: number;

  // arrows
  show_arrows_desktop?: boolean;
  show_arrows_mobile?: boolean; // mobile overlay arrows (default OFF)
  arrows_bg?: string;
  arrows_fg?: string;

  // rail centering
  center_rail_ends?: boolean;

  // section
  section_background_color?: string;
  section_top_margin?: string;
  section_bottom_margin?: string;

  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

/* ------------------------------------------------------------------ */
/* Storefront Section (default export)                                */
/* ------------------------------------------------------------------ */

export default function MainCoupon({
  settings,
}: {
  settings: MainCouponSettings;
}) {
  const s = settings || {};
  if (s.enabled === false) return null;

  const items = useMemo(
    () => (s.items || []).filter((i) => i?.enabled !== false),
    [s.items]
  );

  const align =
    s.align === "center" ? "center" : s.align === "right" ? "right" : "left";
  // const alignClass =
  //   align === "center"
  //     ? "text-center"
  //     : align === "right"
  //     ? "text-right"
  //     : "text-left";

  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // collect refs for all cards (to detect current page on mobile)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setCardRef = (idx: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[idx] = el;
    if (idx === 0 && el) firstCardRef.current = el;
  };

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [padding, setPadding] = useState({ left: 0, right: 0 });

  // active card index (for "1/5" and dots)
  const [activeIdx, setActiveIdx] = useState(0);

  const GAP = s.gap_px ?? 14;
  const fade = 18;

  const computeArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  const computeCenterPads = useCallback(() => {
    const wrap = wrapRef.current;
    const first = firstCardRef.current;
    if (s.center_rail_ends && align === "center" && wrap && first) {
      const containerW = wrap.clientWidth;
      const firstW = first.getBoundingClientRect().width;
      const side = Math.max(
        0,
        Math.round(containerW / 2 - firstW / 2 - GAP / 2)
      );
      setPadding({ left: side, right: side });
    } else {
      setPadding({ left: 0, right: 0 });
    }
  }, [GAP, align, s.center_rail_ends]);

  useEffect(() => {
    computeCenterPads();
    computeArrows();

    const el = railRef.current;
    if (!el) return;

    const onScroll = () => computeArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      computeCenterPads();
      computeArrows();
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [computeCenterPads, computeArrows]);

  // which card is most visible (mobile pager)
  useEffect(() => {
    const root = railRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        let max = -1;
        let idx = activeIdx;
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.idx || 0);
          if (e.intersectionRatio > max) {
            max = e.intersectionRatio;
            idx = i;
          }
        });
        setActiveIdx(idx);
      },
      { root, threshold: [0.25, 0.5, 0.75, 1] }
    );

    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]); // re-run when items change

  const scrollBy = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 520);
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy("right");
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy("left");
    }
  };

  const showDesktopArrows = s.show_arrows_desktop ?? true;
  const showMobileArrows = s.show_arrows_mobile ?? false;

  return (
    <section
      style={{
        background: s.section_background_color || "#fff",
        marginTop: s.section_top_margin || "0rem",
        marginBottom: s.section_bottom_margin || "0.75rem",
      }}
      className="w-full"
    >
      <div ref={wrapRef} className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl">
        {/* Header */}
        {(s.display_title ?? true) && (
          <div
            className={clsx(
              "mb-2 grid items-center",
              align === "center"
                ? "grid-cols-[1fr_auto_1fr]"
                : "grid-cols-[auto_1fr_auto]"
            )}
          >
            {align === "center" ? <div /> : null}

            <h2
              className={clsx(
                "text-lg sm:text-xl font-semibold tracking-tight",
                align === "center"
                  ? "text-center"
                  : align === "right"
                  ? "text-right"
                  : "text-left"
              )}
              style={{ color: s.title_color || "#111827" }}
            >
              {s.title || "Deals for you"}
            </h2>

            {/* Desktop arrows (header, right) */}
            <div
              className={clsx(
                "justify-self-end shrink-0 gap-2",
                showDesktopArrows ? "hidden md:flex" : "hidden"
              )}
            >
              <ArrowBtn
                dir="left"
                onClick={() => scrollBy("left")}
                disabled={!canLeft}
                bg={s.arrows_bg}
                fg={s.arrows_fg}
              />
              <ArrowBtn
                dir="right"
                onClick={() => scrollBy("right")}
                disabled={!canRight}
                bg={s.arrows_bg}
                fg={s.arrows_fg}
              />
            </div>
          </div>
        )}

        {/* Rail + (optional) MOBILE overlay arrows */}
        <div className="relative">
          <div
            ref={railRef}
            role="listbox"
            aria-label="Available deals"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className={clsx(
              "overflow-x-auto overscroll-x-contain no-scrollbar",
              "scroll-smooth focus:outline-none"
            )}
            style={
              {
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
                paddingBottom: 2,
                paddingLeft: padding.left,
                paddingRight: padding.right,
                maskImage: `linear-gradient(to right, transparent 0, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`,
                WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`,
              } as React.CSSProperties
            }
          >
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {items.map((it, idx) => {
                const Tag: any = it.href ? "a" : "div";
                const isActive = idx === activeIdx;
                return (
                  <Tag
                    key={idx}
                    ref={setCardRef(idx)}
                    data-idx={idx}
                    href={it.href}
                    role="option"
                    aria-label={`${it.title ?? "Offer"}`}
                    className={clsx(
                      "relative flex items-center shrink-0 select-none",
                      "w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] md:w-auto",
                      "[scroll-snap-align:center] md:[scroll-snap-align:start]",
                      s.card_border ? "border" : "border border-transparent",
                      s.card_shadow ? "shadow-sm" : "",
                      "transition-transform hover:-translate-y-0.5 rounded-[--card-radius]"
                    )}
                    style={{
                      // use a CSS var so we can animate radius from controls
                      // @ts-ignore
                      ["--card-radius" as any]: (s.card_radius ?? 18) + "px",
                      height: (s.card_height_px ?? 72) + "px",
                      borderColor: s.card_border
                        ? s.card_border_color || "#E5E7EB"
                        : "transparent",
                      background: s.card_bg || "#ffffff",
                      paddingLeft: (s.card_horizontal_pad_px ?? 18) + "px",
                      paddingRight: (s.card_horizontal_pad_px ?? 18) + "px",
                    }}
                  >
                    <span
                      className="inline-grid place-items-center text-[10px] font-extrabold uppercase tracking-wide"
                      style={{
                        background: it.badge_bg || "#F97316",
                        color: it.badge_color || "#ffffff",
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                      }}
                    >
                      {it.badge_text || "DEAL"}
                    </span>

                    <div className="ml-3 min-w-0 whitespace-nowrap">
                      <div
                        className="text-sm sm:text-[15px] font-extrabold tracking-tight truncate"
                        style={{ color: s.card_text_color || "#111827" }}
                      >
                        {it.title || ""}
                      </div>
                      {it.subtitle ? (
                        <div
                          className="text-[11px] sm:text-xs uppercase tracking-wide truncate"
                          style={{
                            color: s.card_subtle_text_color || "#6B7280",
                          }}
                        >
                          {it.subtitle}
                        </div>
                      ) : null}
                    </div>

                    {/* Mobile pager inside the active card */}
                    {isActive && (
                      <MobilePager index={activeIdx} total={items.length} />
                    )}
                  </Tag>
                );
              })}
            </div>
          </div>

          {/* Optional mobile overlay arrows (default OFF) */}
          {showMobileArrows && (
            <div
              className="md:hidden absolute inset-y-0 left-0 right-0 pointer-events-none"
              aria-hidden
            >
              <div className="absolute left-1 top-1/2 -translate-y-1/2">
                <ArrowBtn
                  dir="left"
                  onClick={() => scrollBy("left")}
                  disabled={!canLeft}
                  bg={s.arrows_bg}
                  fg={s.arrows_fg}
                  className="pointer-events-auto shadow-sm ring-1 ring-black/5"
                />
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <ArrowBtn
                  dir="right"
                  onClick={() => scrollBy("right")}
                  disabled={!canRight}
                  bg={s.arrows_bg}
                  fg={s.arrows_fg}
                  className="pointer-events-auto shadow-sm ring-1 ring-black/5"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {s.custom_css ? (
        <style dangerouslySetInnerHTML={{ __html: String(s.custom_css) }} />
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Settings Card (collapsible)                                        */
/* ------------------------------------------------------------------ */

export function MainCouponSettingsCard({
  ui,
  onChange,
  defaultOpen = true,
}: {
  ui: MainCouponSettings;
  onChange: (next: MainCouponSettings) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const enabled = ui.enabled ?? true;
  const statusOn =
    enabled && (ui.items || []).some((i) => i?.enabled !== false);

  const set = (patch: Partial<MainCouponSettings>) =>
    onChange({ ...ui, ...patch });

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900">
            Deals / Coupons Rail
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Highlight top offers with a horizontally scrolling rail.
          </p>
        </div>

        {/* live status dot */}
        <span
          className={clsx(
            "mt-1.5 h-2.5 w-2.5 rounded-full",
            statusOn ? "bg-emerald-500" : "bg-gray-300"
          )}
          aria-hidden
        />

        {/* enable switch */}
        <Switch
          checked={enabled}
          onChange={(v) => set({ enabled: v })}
          className="ml-2 mt-0.5"
        />

        {/* collapse */}
        <button
          aria-label={open ? "Collapse" : "Expand"}
          onClick={() => setOpen((v) => !v)}
          className="ml-1 inline-grid h-8 w-8 place-items-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <ChevronUp
            className={clsx(
              "h-4 w-4 transition-transform",
              !open && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Body */}
      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 p-4 sm:p-5">
            {/* Controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input
                  type="text"
                  value={ui.title ?? "Deals for you"}
                  onChange={(e) => set({ title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </Field>

              <Field label="Heading alignment">
                <select
                  value={ui.align ?? "left"}
                  onChange={(e) => set({ align: e.target.value as any })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </Field>

              <Field label="Show arrows (desktop)">
                <Toggle
                  checked={ui.show_arrows_desktop ?? true}
                  onChange={(v) => set({ show_arrows_desktop: v })}
                />
              </Field>

              <Field label="Show arrows (mobile)">
                <Toggle
                  checked={ui.show_arrows_mobile ?? false}
                  onChange={(v) => set({ show_arrows_mobile: v })}
                />
              </Field>

              <Field label="Card radius (px)">
                <NumberInput
                  min={0}
                  max={30}
                  step={1}
                  value={ui.card_radius ?? 18}
                  onChange={(v) => set({ card_radius: v })}
                />
              </Field>

              <Field label="Gap between cards (px)">
                <NumberInput
                  min={6}
                  max={32}
                  step={1}
                  value={ui.gap_px ?? 14}
                  onChange={(v) => set({ gap_px: v })}
                />
              </Field>

              <Field label="Height (px)">
                <NumberInput
                  min={56}
                  max={108}
                  step={2}
                  value={ui.card_height_px ?? 72}
                  onChange={(v) => set({ card_height_px: v })}
                />
              </Field>

              <Field label="Center rail ends">
                <Toggle
                  checked={ui.center_rail_ends ?? false}
                  onChange={(v) => set({ center_rail_ends: v })}
                />
              </Field>
            </div>

            {/* Live preview */}
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <MainCoupon settings={ui} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                    */
/* ------------------------------------------------------------------ */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[13px] font-medium text-gray-700">{label}</div>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={Number(value ?? 0)}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    />
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked?: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-indigo-600" : "bg-gray-300",
        disabled && "opacity-50"
      )}
    >
      <span
        className={clsx(
          "ml-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/10 transition",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// compact switch with margin control (for header)
function Switch({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
        checked ? "bg-[#3B82F6]" : "bg-gray-300",
        className
      )}
    >
      <span
        className={clsx(
          "inline-block h-6 w-6 translate-x-0 transform rounded-full bg-white shadow ring-1 ring-black/10 transition",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M5.23 12.21a.75.75 0 001.06.02L10 8.67l3.71 3.56a.75.75 0 001.04-1.08l-4.23-4.06a.75.75 0 00-1.04 0L5.21 11.15a.75.75 0 00.02 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* Arrow Button */
function ArrowBtn({
  dir,
  onClick,
  disabled,
  bg,
  fg,
  className,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  bg?: string;
  fg?: string;
  className?: string;
}) {
  return (
    <button
      aria-label={dir === "left" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={!!disabled}
      className={clsx(
        "h-9 w-9 rounded-full grid place-items-center transition-opacity",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      style={{ background: bg || "#F3F4F6", color: fg || "#111827" }}
    >
      {dir === "left" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6z" />
        </svg>
      )}
    </button>
  );
}

/* Mobile pager (1/5 + three tiny dots) */
function MobilePager({ index, total }: { index: number; total: number }) {
  const slot = index === 0 ? 0 : index === total - 1 ? 2 : 1; // 0: start, 1: middle, 2: end
  return (
    <div
      className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-right pointer-events-none select-none"
      role="status"
      aria-live="polite"
    >
      <div className="text-[12px] font-semibold" style={{ color: "#F97316" }}>
        {index + 1}/{total}
      </div>
      <div className="mt-0.5 flex items-center justify-end gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={clsx(
              "inline-block rounded-full",
              "w-1.5 h-1.5",
              i === slot ? "bg-[#F97316]" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
