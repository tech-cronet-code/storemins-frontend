import React, { useEffect, useMemo, useRef, useState } from "react";

export type FlashSaleHeroSettings = {
  enabled?: boolean;

  headline?: string;
  subheadline?: string;
  show_countdown?: boolean;
  countdown_end_iso?: string | null;
  cta_label?: string;
  cta_href?: string;

  height_desktop?: number;
  height_mobile?: number;

  background_image?: string;
  background_color?: string;
  text_color?: string;
  overlay_color?: string;
  overlay_opacity?: number; // 0-100
  align?: "left" | "center" | "right";

  badge_show?: boolean;
  badge_text?: string;
  badge_color?: string;

  show_deals_grid?: boolean;
  show_carousel?: boolean;
  show_urgency_strip?: boolean;

  deals?: {
    section_background_color?: string;
    section_top_margin?: string;
    section_bottom_margin?: string;
    title?: string | boolean;
    title_color?: string;
    grid_cols?: 2 | 3 | 4;
    show_price?: boolean;
    show_compare_at?: boolean;
    card_radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
    card_shadow?: "sm" | "md" | "lg";
    image_aspect?: string; // "1/1", "4/5"
    show_badge?: boolean;
    sample_products?: Array<{
      image: string;
      name: string;
      price?: number;
      compare_at_price?: number;
      href?: string;
    }>;
  };

  carousel?: {
    section_background_color?: string;
    section_top_margin?: string;
    section_bottom_margin?: string;
    display_title?: boolean;
    title?: string;
    badge_text?: string;
    auto_scroll?: boolean;
    scroll_speed_ms?: number;
    sample_products?: Array<{
      image: string;
      name: string;
      price?: number;
      href?: string;
    }>;
    show_dots?: boolean;
  };

  urgency?: {
    section_background_color?: string;
    border?: boolean;
    text_color?: string;
    show_icons?: boolean;
    show_timer?: boolean;
    show_stock?: boolean;
    stock_left?: number;
    stock_total?: number;
    accent_color?: string;
    show_rating?: boolean;
    rating_value?: number;
    rating_count?: number;
  };

  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

const DEFAULT_BG =
  "https://moosend.com/wp-content/uploads/2024/12/flash_sales_email_examples.png";

const vis = (v: "all" | "desktop" | "mobile" = "all") =>
  v === "desktop" ? "hidden md:block" : v === "mobile" ? "block md:hidden" : "";

function useCountdown(endIso?: string | null) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => {
    if (!endIso) return null;
    const end = new Date(endIso).getTime();
    const diff = Math.max(0, end - now);
    const hh = Math.floor(diff / 3_600_000);
    const mm = Math.floor((diff % 3_600_000) / 60_000);
    const ss = Math.floor((diff % 60_000) / 1000);
    return { hh, mm, ss, isOver: diff <= 0 };
  }, [endIso, now]);
}

export const FlashSaleHeroBlock: React.FC<{ settings?: FlashSaleHeroSettings }> = ({
  settings,
}) => {
  const s = settings || {};
  if (s.enabled === false) return null;

  const {
    headline = "FLAT 50% OFF",
    subheadline = "Today only",
    show_countdown = true,
    countdown_end_iso = null,
    cta_label = "Shop Now",
    cta_href = "/collections/flash-sale",

    background_image = DEFAULT_BG,
    background_color = "#ffffff",
    text_color = "#111827",
    overlay_color = "#000000",
    overlay_opacity = 20,
    align = "center",
    badge_show = true,
    badge_text = "LIMITED",
    badge_color = "#111827",

    height_mobile = 140,
    height_desktop = 200,

    show_deals_grid = false,
    show_carousel = false,
    show_urgency_strip = false,

    deals = {},
    carousel = {},
    urgency = {},

    custom_css,
    visibility = "all",
  } = s;

  const bgUrl =
    typeof background_image === "string" && background_image.trim()
      ? background_image.trim()
      : DEFAULT_BG;

  const countdown = useCountdown(show_countdown ? countdown_end_iso : null);

  const dealsProducts = (deals as any).sample_products || [];
  const carouselProducts = (carousel as any).sample_products || [];

  const scroller = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!show_carousel || !(carousel as any).auto_scroll || !scroller.current)
      return;
    const el = scroller.current;
    const timer = setInterval(() => {
      el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
        el.scrollTo({ left: 0 });
    }, Number((carousel as any).scroll_speed_ms ?? 2000));
    return () => clearInterval(timer);
  }, [
    show_carousel,
    (carousel as any).auto_scroll,
    (carousel as any).scroll_speed_ms,
  ]);

  return (
    <section className={vis(visibility)}>
      <style>{`
        ${custom_css || ""}
        .fs-hero{ min-height:${height_mobile}px; }
        @media (min-width:768px){ .fs-hero{ min-height:${height_desktop}px; } }
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* HERO */}
      <div
        className="fs-hero relative w-full overflow-hidden"
        style={{ backgroundColor: bgUrl ? undefined : background_color }}
      >
        <img
          src={bgUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />
        {overlay_opacity > 0 && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundColor: overlay_color,
              opacity: overlay_opacity / 100,
            }}
            aria-hidden="true"
          />
        )}

        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col ${
            align === "left"
              ? "items-start text-left"
              : align === "right"
              ? "items-end text-right"
              : "items-center text-center"
          }`}
          style={{ color: text_color }}
        >
          {badge_show && (
            <span
              className="mb-2 inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wide"
              style={{
                background: badge_color,
                color: "#ffffff",
                borderRadius: 4,
              }}
            >
              {badge_text}
            </span>
          )}

          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {headline}
          </h2>

          {subheadline ? (
            <p className="mt-1 opacity-80 text-sm md:text-base">
              {subheadline}
            </p>
          ) : null}

          {show_countdown && countdown && !countdown.isOver && (
            <div className="mt-3 text-xl md:text-2xl font-mono tabular-nums">
              {String(countdown.hh).padStart(2, "0")}:
              {String(countdown.mm).padStart(2, "0")}:
              {String(countdown.ss).padStart(2, "0")}
            </div>
          )}

          {cta_label && (
            <a
              href={cta_href || "#"}
              className="mt-4 inline-flex items-center justify-center px-4 py-2.5 text-sm md:text-base font-semibold text-white bg-gray-900 hover:bg-black transition"
              style={{ borderRadius: 6 }}
            >
              {cta_label}
            </a>
          )}
        </div>
      </div>

      {/* DEALS GRID */}
      {show_deals_grid && (
        <div
          className="w-full"
          style={{
            background: (deals as any).section_background_color || "#cccccc",
            marginTop: (deals as any).section_top_margin || "0rem",
            marginBottom: (deals as any).section_bottom_margin || "1rem",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-5">
            {(deals as any).title !== false && (
              <h3
                className="text-lg md:text-xl font-semibold mb-3"
                style={{ color: (deals as any).title_color || "#111827" }}
              >
                {(deals as any).title || "Top Deals"}
              </h3>
            )}
            <div
              className={`grid gap-3 md:gap-4 ${
                (deals as any).grid_cols === 4
                  ? "grid-cols-2 md:grid-cols-4"
                  : (deals as any).grid_cols === 3
                  ? "grid-cols-2 md:grid-cols-3"
                  : "grid-cols-2"
              }`}
            >
              {dealsProducts.map((p: any, idx: number) => {
                const off =
                  p.compare_at_price && p.price
                    ? Math.max(
                        0,
                        Math.round(
                          ((p.compare_at_price - p.price) / p.compare_at_price) *
                            100
                        )
                      )
                    : null;
                return (
                  <a
                    key={idx}
                    href={p.href || "#"}
                    className={`group relative overflow-hidden rounded-${
                      (deals as any).card_radius || "md"
                    } shadow-${(deals as any).card_shadow || "sm"} bg-white`}
                  >
                    <div
                      className="w-full overflow-hidden"
                      style={{
                        aspectRatio: (deals as any).image_aspect || "1/1",
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-[1.03] transition"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium line-clamp-1">
                        {p.name}
                      </div>
                      {(deals as any).show_price && (
                        <div className="mt-0.5 flex items-baseline gap-2">
                          {p.price != null && (
                            <span className="text-base font-semibold">
                              ₹{(p.price / 100).toFixed(0)}
                            </span>
                          )}
                          {(deals as any).show_compare_at &&
                            p.compare_at_price != null && (
                              <span className="text-xs line-through opacity-60">
                                ₹{(p.compare_at_price / 100).toFixed(0)}
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                    {off ? (
                      <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        -{off}%
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CAROUSEL */}
      {show_carousel && (
        <div
          className="w-full"
          style={{
            background: (carousel as any).section_background_color || "#cccccc",
            marginTop: (carousel as any).section_top_margin || "0rem",
            marginBottom: (carousel as any).section_bottom_margin || "1rem",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-5">
            {(carousel as any).display_title && (
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                {(carousel as any).title || "Hot Right Now"}
              </h3>
            )}
            <div className="relative border rounded-lg">
              <span className="absolute left-0 top-0 m-2 rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {(carousel as any).badge_text || "HOT"}
              </span>
              <div
                ref={scroller}
                className="overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-3 p-3"
              >
                {carouselProducts.map((p: any, idx: number) => (
                  <a
                    key={idx}
                    href={p.href || "#"}
                    className="snap-start min-w-[180px] max-w-[200px] shrink-0 rounded-lg bg-white shadow-sm overflow-hidden"
                  >
                    <div className="w-full" style={{ aspectRatio: "1/1" }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium line-clamp-1">
                        {p.name}
                      </div>
                      {p.price != null && (
                        <div className="mt-0.5 text-sm font-semibold">
                          ₹{(p.price / 100).toFixed(0)}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
              {(carousel as any).show_dots && (
                <div className="pb-2 text-center opacity-60 text-xs">• • •</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* URGENCY STRIP */}
      {show_urgency_strip && (
        <div
          className="w-full"
          style={{
            background: (urgency as any).section_background_color || "#cccccc",
          }}
        >
          <div
            className={`max-w-7xl mx-auto px-4 py-2.5 ${
              (urgency as any).border ? "border-t border-b" : ""
            }`}
            style={{ color: (urgency as any).text_color || "#111827" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <div className="flex items-center gap-2">
                {(urgency as any).show_icons && (
                  <i
                    className="ri-timer-2-line"
                    style={{
                      color: (urgency as any).accent_color || "#ef4444",
                    }}
                  />
                )}
                <span className="text-xs md:text-sm opacity-80">Sale ends in</span>
                {(urgency as any).show_timer && countdown && !countdown.isOver ? (
                  <span className="font-mono font-semibold tabular-nums text-sm md:text-base">
                    {String(countdown.hh).padStart(2, "0")}:
                    {String(countdown.mm).padStart(2, "0")}:
                    {String(countdown.ss).padStart(2, "0")}
                  </span>
                ) : (
                  <span className="font-semibold text-sm">—</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {(urgency as any).show_icons && (
                  <i
                    className="ri-archive-line"
                    style={{
                      color: (urgency as any).accent_color || "#ef4444",
                    }}
                  />
                )}
                <span className="text-xs md:text-sm opacity-80">
                  Only {(urgency as any).stock_left ?? 0} left
                </span>
                {(urgency as any).show_stock && (
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            Math.round(
                              ((((urgency as any).stock_total ?? 1) -
                                ((urgency as any).stock_left ?? 0)) /
                                Math.max(1, (urgency as any).stock_total ?? 1)) *
                                100
                            )
                          )
                        )}%`,
                        background: (urgency as any).accent_color || "#ef4444",
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center md:justify-end gap-1.5">
                {(urgency as any).show_icons && (
                  <i
                    className="ri-star-fill"
                    style={{
                      color: (urgency as any).accent_color || "#ef4444",
                    }}
                  />
                )}
                {(urgency as any).show_rating ? (
                  <span className="text-xs md:text-sm">
                    <span className="font-semibold">
                      {Number((urgency as any).rating_value ?? 4.8).toFixed(1)}
                    </span>{" "}
                    / 5 ·{" "}
                    {Number(
                      (urgency as any).rating_count ?? 1200
                    ).toLocaleString()}
                    + sold
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
