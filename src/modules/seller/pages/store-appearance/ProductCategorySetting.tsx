/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

/** ---------------- Types ---------------- */
export type ProductCategoryUI = {
  enabled: boolean;

  /** Layout & content */
  layout: "grid" | "carousel";
  title: string;
  subtitle: string;

  /** Data source */
  useManualSelection: boolean;
  categoryIdsCsv: string; // comma-separated list of category IDs
  maxItems: number;

  /** Grid */
  gridDesktop: number;
  gridTablet: number;
  gridMobile: number;

  /** Card look & feel */
  showImages: boolean;
  showCounts: boolean;
  cardRadius: number;
  cardBackground: string;
  cardBorder: string;

  /** Advanced */
  visibility: "all" | "desktop" | "mobile";
  custom_css: string | null;
};

export const defaultProductCategoryUI: ProductCategoryUI = {
  enabled: true,

  layout: "grid",
  title: "Shop by category",
  subtitle: "Browse our top categories",

  useManualSelection: false,
  categoryIdsCsv: "",
  maxItems: 8,

  gridDesktop: 4,
  gridTablet: 3,
  gridMobile: 2,

  showImages: true,
  showCounts: true,
  cardRadius: 16,
  cardBackground: "#ffffff",
  cardBorder: "#ECEFF3",

  visibility: "all",
  custom_css: null,
};

/** ---------------- Settings Card ---------------- */
const ProductCategorySettingsCard: React.FC<{
  ui: ProductCategoryUI;
  onChange: (next: ProductCategoryUI) => void;
}> = ({ ui, onChange }) => {
  const s = { ...defaultProductCategoryUI, ...(ui || {}) };
  const set = (patch: Partial<ProductCategoryUI>) =>
    onChange({ ...s, ...patch });

  const [csv, setCsv] = useState<string>(s.categoryIdsCsv || "");

  return (
    <div className="rounded-xl border border-gray-200 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Categories</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.enabled}
            onChange={(e) => set({ enabled: e.target.checked })}
          />
          Enabled
        </label>
      </div>

      {/* Section header */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm mb-1">Section title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={s.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Shop by category"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Subtitle</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={s.subtitle}
            onChange={(e) => set({ subtitle: e.target.value })}
            placeholder="Browse our top categories"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <label className="block text-sm mb-1">Layout</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={s.layout}
            onChange={(e) =>
              set({ layout: e.target.value as ProductCategoryUI["layout"] })
            }
          >
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Max items</label>
          <input
            type="number"
            min={1}
            max={24}
            className="w-full border rounded px-3 py-2"
            value={s.maxItems}
            onChange={(e) => set({ maxItems: Number(e.target.value) || 8 })}
          />
        </div>
      </div>

      {/* Data source */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.useManualSelection}
            onChange={(e) => set({ useManualSelection: e.target.checked })}
          />
          Select categories manually (comma-separated IDs)
        </label>
        <textarea
          className="w-full border rounded px-3 py-2 font-mono text-xs"
          rows={3}
          disabled={!s.useManualSelection}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          onBlur={() => set({ categoryIdsCsv: csv })}
          placeholder="cat_123, cat_456, cat_789"
        />
        {!s.useManualSelection ? (
          <p className="text-xs text-gray-500">
            When disabled, the block will auto-fetch top categories (by product
            count or recency).
          </p>
        ) : null}
      </div>

      {/* Grid */}
      <div>
        <h4 className="font-medium mb-3">Grid</h4>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1">Desktop cols</label>
            <input
              type="number"
              min={1}
              max={6}
              className="w-full border rounded px-3 py-2"
              value={s.gridDesktop}
              onChange={(e) =>
                set({ gridDesktop: Number(e.target.value) || 4 })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tablet cols</label>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full border rounded px-3 py-2"
              value={s.gridTablet}
              onChange={(e) => set({ gridTablet: Number(e.target.value) || 3 })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Mobile cols</label>
            <input
              type="number"
              min={1}
              max={4}
              className="w-full border rounded px-3 py-2"
              value={s.gridMobile}
              onChange={(e) => set({ gridMobile: Number(e.target.value) || 2 })}
            />
          </div>
        </div>
      </div>

      {/* Card appearance */}
      <div>
        <h4 className="font-medium mb-3">Card appearance</h4>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.showImages}
              onChange={(e) => set({ showImages: e.target.checked })}
            />
            Show images
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.showCounts}
              onChange={(e) => set({ showCounts: e.target.checked })}
            />
            Show product counts
          </label>
          <div>
            <label className="block text-sm mb-1">Card radius (px)</label>
            <input
              type="number"
              min={0}
              max={24}
              className="w-full border rounded px-3 py-2"
              value={s.cardRadius}
              onChange={(e) => set({ cardRadius: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Card background</label>
            <input
              type="color"
              className="w-full h-10 p-1 border rounded"
              value={s.cardBackground}
              onChange={(e) => set({ cardBackground: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Border color</label>
            <input
              type="color"
              className="w-full h-10 p-1 border rounded"
              value={s.cardBorder}
              onChange={(e) => set({ cardBorder: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <label className="block text-sm mb-1">Visibility</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={s.visibility}
            onChange={(e) => set({ visibility: e.target.value as any })}
          >
            <option value="all">all</option>
            <option value="desktop">desktop</option>
            <option value="mobile">mobile</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Custom CSS</label>
          <textarea
            className="w-full border rounded px-3 py-2 font-mono text-xs"
            rows={5}
            value={s.custom_css || ""}
            onChange={(e) => set({ custom_css: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCategorySettingsCard;

/** ---------------- Mappers (server <-> UI) ----------------
 * These helpers mirror the pattern used elsewhere in the page.
 */
export type ProductCategoryServerSettings = {
  layout?: "grid" | "carousel";
  section_title?: string;
  section_subtitle?: string;

  categoryIds?: string[] | null;
  maxItems?: number;

  grid?: {
    cols_desktop?: number;
    cols_tablet?: number;
    cols_mobile?: number;
  };

  showImages?: boolean;
  showCounts?: boolean;
  card?: { radius?: number; background?: string; border?: string };

  visibility?: "all" | "desktop" | "mobile";
  custom_css?: string | null;
};

export const mapProductCategoryToUI = (
  s?: ProductCategoryServerSettings
): ProductCategoryUI => ({
  ...defaultProductCategoryUI,
  layout: (s?.layout as ProductCategoryUI["layout"]) ?? "grid",
  title: s?.section_title ?? defaultProductCategoryUI.title,
  subtitle: s?.section_subtitle ?? defaultProductCategoryUI.subtitle,

  useManualSelection:
    Array.isArray(s?.categoryIds) && s!.categoryIds!.length > 0,
  categoryIdsCsv: Array.isArray(s?.categoryIds)
    ? s!.categoryIds!.join(", ")
    : "",
  maxItems: Number(s?.maxItems ?? defaultProductCategoryUI.maxItems),

  gridDesktop: Number(
    s?.grid?.cols_desktop ?? defaultProductCategoryUI.gridDesktop
  ),
  gridTablet: Number(
    s?.grid?.cols_tablet ?? defaultProductCategoryUI.gridTablet
  ),
  gridMobile: Number(
    s?.grid?.cols_mobile ?? defaultProductCategoryUI.gridMobile
  ),

  showImages: s?.showImages ?? defaultProductCategoryUI.showImages,
  showCounts: s?.showCounts ?? defaultProductCategoryUI.showCounts,
  cardRadius: Number(s?.card?.radius ?? defaultProductCategoryUI.cardRadius),
  cardBackground:
    s?.card?.background ?? defaultProductCategoryUI.cardBackground,
  cardBorder: s?.card?.border ?? defaultProductCategoryUI.cardBorder,

  visibility: (s?.visibility as ProductCategoryUI["visibility"]) ?? "all",
  custom_css: s?.custom_css ?? null,
});

export const mergeProductCategoryFromUI = (
  existing: ProductCategoryServerSettings | undefined,
  ui: ProductCategoryUI
): ProductCategoryServerSettings => {
  const csv = (ui.categoryIdsCsv || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    ...(existing || {}),
    layout: ui.layout,
    section_title: ui.title,
    section_subtitle: ui.subtitle,

    categoryIds: ui.useManualSelection ? csv : null,
    maxItems: Number(ui.maxItems),

    grid: {
      ...(existing?.grid || {}),
      cols_desktop: Number(ui.gridDesktop),
      cols_tablet: Number(ui.gridTablet),
      cols_mobile: Number(ui.gridMobile),
    },

    showImages: !!ui.showImages,
    showCounts: !!ui.showCounts,
    card: {
      ...(existing?.card || {}),
      radius: Number(ui.cardRadius),
      background: ui.cardBackground,
      border: ui.cardBorder,
    },

    visibility: ui.visibility,
    custom_css: ui.custom_css,
  };
};
