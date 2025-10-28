import React from "react";

export type FlashSaleHeroUI = {
  enabled?: boolean;

  headline: string;
  subheadline: string;
  show_countdown: boolean;
  countdown_end_iso: string | null;
  cta_label: string;
  cta_href: string;

  height_desktop: number;
  height_mobile: number;

  background_image: string;
  background_color: string;
  text_color: string;
  overlay_color: string;
  overlay_opacity: number;
  align: "left" | "center" | "right";

  badge_show: boolean;
  badge_text: string;
  badge_color: string;

  show_deals_grid: boolean;
  show_carousel: boolean;
  show_urgency_strip: boolean;

  deals: {
    section_background_color: string;
    section_top_margin: string;
    section_bottom_margin: string;
    title: string | boolean;
    title_color: string;
    grid_cols: 2 | 3 | 4;
    show_price: boolean;
    show_compare_at: boolean;
    card_radius: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
    card_shadow: "sm" | "md" | "lg";
    image_aspect: string;
    show_badge: boolean;
    sample_products: any[];
  };

  carousel: {
    section_background_color: string;
    section_top_margin: string;
    section_bottom_margin: string;
    display_title: boolean;
    title: string;
    badge_text: string;
    auto_scroll: boolean;
    scroll_speed_ms: number;
    sample_products: any[];
    show_dots: boolean;
  };

  urgency: {
    section_background_color: string;
    border: boolean;
    text_color: string;
    show_icons: boolean;
    show_timer: boolean;
    show_stock: boolean;
    stock_left: number;
    stock_total: number;
    accent_color: string;
    show_rating: boolean;
    rating_value: number;
    rating_count: number;
  };

  custom_css: string | null;
  visibility: "all" | "desktop" | "mobile";
};

export const defaultFlashSaleHeroUI: FlashSaleHeroUI = {
  enabled: true,

  headline: "FLAT 50% OFF",
  subheadline: "Today only",
  show_countdown: true,
  countdown_end_iso: null,
  cta_label: "Shop Now",
  cta_href: "/collections/flash-sale",

  height_desktop: 200,
  height_mobile: 140,

  background_image:
    "https://moosend.com/wp-content/uploads/2024/12/flash_sales_email_examples.png",
  background_color: "#cccccc",
  text_color: "#111827",
  overlay_color: "#000000",
  overlay_opacity: 20,
  align: "center",

  badge_show: true,
  badge_text: "LIMITED",
  badge_color: "#111827",

  show_deals_grid: false,
  show_carousel: false,
  show_urgency_strip: false,

  deals: {
    section_background_color: "#cccccc",
    section_top_margin: "0rem",
    section_bottom_margin: "1rem",
    title: "Top Deals",
    title_color: "#111827",
    grid_cols: 3,
    show_price: true,
    show_compare_at: true,
    card_radius: "md",
    card_shadow: "sm",
    image_aspect: "1/1",
    show_badge: true,
    sample_products: [],
  },

  carousel: {
    section_background_color: "#cccccc",
    section_top_margin: "0rem",
    section_bottom_margin: "1rem",
    display_title: true,
    title: "Hot Right Now",
    badge_text: "HOT",
    auto_scroll: false,
    scroll_speed_ms: 2000,
    sample_products: [],
    show_dots: true,
  },

  urgency: {
    section_background_color: "#cccccc",
    border: false,
    text_color: "#111827",
    show_icons: true,
    show_timer: true,
    show_stock: true,
    stock_left: 37,
    stock_total: 100,
    accent_color: "#ef4444",
    show_rating: true,
    rating_value: 4.8,
    rating_count: 1200,
  },

  custom_css: null,
  visibility: "all",
};

export type FlashSaleHeroServerSettings = Partial<FlashSaleHeroUI>;

export const mapFlashSaleHeroToUI = (
  s?: FlashSaleHeroServerSettings,
  enabled?: number | boolean
): FlashSaleHeroUI => ({
  ...defaultFlashSaleHeroUI,
  ...(s || {}),
  enabled:
    typeof enabled === "number"
      ? enabled !== 0
      : typeof enabled === "boolean"
      ? enabled
      : true,
});

export const mergeFlashSaleHeroFromUI = (
  existing: FlashSaleHeroServerSettings | undefined,
  ui: FlashSaleHeroUI
): FlashSaleHeroServerSettings => ({
  ...(existing || {}),
  ...ui,
  overlay_opacity: Number(ui.overlay_opacity),
  height_desktop: Number(ui.height_desktop),
  height_mobile: Number(ui.height_mobile),
  urgency: {
    ...(existing?.urgency || {}),
    ...(ui.urgency || ({} as any)),
    stock_left: Number(ui.urgency.stock_left),
    stock_total: Number(ui.urgency.stock_total),
    rating_value: Number(ui.urgency.rating_value),
    rating_count: Number(ui.urgency.rating_count),
  },
  carousel: {
    ...(existing?.carousel || {}),
    ...(ui.carousel || ({} as any)),
    scroll_speed_ms: Number(ui.carousel.scroll_speed_ms),
  },
});

const Switch: React.FC<{
  checked: boolean;
  onToggle: (v: boolean) => void;
}> = ({ checked, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-[#0A84FF]" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

const Color: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-slate-800">{label}</div>
    <div className="flex items-center gap-3">
      <input
        type="color"
        className="h-10 w-10 rounded-lg border border-slate-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-wider"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export const FlashSaleHeroSettingsCard: React.FC<{
  ui: FlashSaleHeroUI;
  onChange: (ui: FlashSaleHeroUI) => void;
}> = ({ ui, onChange }) => {
  const set = <K extends keyof FlashSaleHeroUI>(k: K, v: FlashSaleHeroUI[K]) =>
    onChange({ ...ui, [k]: v });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Flash Sale Hero
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Full-bleed hero with optional countdown + promo sections.
          </p>
        </div>
        <Switch checked={!!ui.enabled} onToggle={(v) => set("enabled", v)} />
      </div>

      <div className="border-t border-slate-200 p-4 space-y-6">
        {/* Headline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-800">
              Headline
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.headline}
              onChange={(e) => set("headline", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              CTA label
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.cta_label}
              onChange={(e) => set("cta_label", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-800">
              Subheadline
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.subheadline}
              onChange={(e) => set("subheadline", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              CTA link
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.cta_href}
              onChange={(e) => set("cta_href", e.target.value)}
            />
          </div>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">
              Show countdown
            </div>
            <Switch
              checked={ui.show_countdown}
              onToggle={(v) => set("show_countdown", v)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-800">
              Ends at (ISO)
            </label>
            <input
              type="text"
              placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.countdown_end_iso || ""}
              onChange={(e) => set("countdown_end_iso", e.target.value || null)}
            />
          </div>
        </div>

        {/* Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-800">
              Background image URL
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.background_image}
              onChange={(e) => set("background_image", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Align</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.align}
              onChange={(e) =>
                set("align", e.target.value as FlashSaleHeroUI["align"])
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <Color
            label="Text color"
            value={ui.text_color}
            onChange={(v) => set("text_color", v)}
          />
          <Color
            label="Overlay color"
            value={ui.overlay_color}
            onChange={(v) => set("overlay_color", v)}
          />
          <div>
            <label className="text-sm font-medium text-slate-800">
              Overlay opacity (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.overlay_opacity}
              onChange={(e) => set("overlay_opacity", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              Height (desktop)
            </label>
            <input
              type="number"
              min={160}
              max={800}
              step={10}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.height_desktop}
              onChange={(e) => set("height_desktop", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              Height (mobile)
            </label>
            <input
              type="number"
              min={120}
              max={600}
              step={10}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.height_mobile}
              onChange={(e) => set("height_mobile", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">Show badge</div>
            <Switch
              checked={ui.badge_show}
              onToggle={(v) => set("badge_show", v)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              Badge text
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.badge_text}
              onChange={(e) => set("badge_text", e.target.value)}
            />
          </div>
          <Color
            label="Badge color"
            value={ui.badge_color}
            onChange={(v) => set("badge_color", v)}
          />
        </div>

        {/* Sections toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">Deals grid</div>
            <Switch
              checked={ui.show_deals_grid}
              onToggle={(v) => set("show_deals_grid", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">Carousel</div>
            <Switch
              checked={ui.show_carousel}
              onToggle={(v) => set("show_carousel", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">
              Urgency strip
            </div>
            <Switch
              checked={ui.show_urgency_strip}
              onToggle={(v) => set("show_urgency_strip", v)}
            />
          </div>
        </div>

        {/* Advanced */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-800">
              Custom CSS
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder={`/* optional */`}
              value={ui.custom_css || ""}
              onChange={(e) => set("custom_css", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              Visibility
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.visibility}
              onChange={(e) =>
                set(
                  "visibility",
                  e.target.value as FlashSaleHeroUI["visibility"]
                )
              }
            >
              <option value="all">All</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleHeroSettingsCard;
