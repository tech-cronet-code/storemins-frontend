/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/seller/pages/store-appearance/AddStoreDiplaySettingPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../../dashboard/components/Layout";
import { UserRoleName } from "../../../auth/constants/userRoles";

import GeneralSettings from "../../components/store-appearance/GeneralSettings";
import HeaderSettings from "../../components/store-appearance/HeaderSettings";
import StorePreview from "../../components/store-appearance/StorePreview";
import TermsOfServiceSettings from "../../components/store-appearance/TermsOfServiceSettings";

import {
  useGetMyStoreDetailsQuery,
  useGetCurrentThemeQuery,
  useGetStorefrontDataQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  usePublishThemeMutation,
} from "../../../auth/services/storeApi";
import { useAuth } from "../../../auth/contexts/AuthContext";

import {
  mapTopNavToUI,
  mergeTopNavFromUI,
} from "../../../../shared/blocks/topNav";
import { TopNavSettingsCard } from "./TopNavSettings";

import {
  StoreHeroUI,
  defaultStoreHeroUI,
  StoreHeroSettingsCard,
} from "../../components/store-appearance/StoreHeroSettings";

/* ---------- Store Stats ---------- */
import { StoreStatsSettings } from "../../../../shared/blocks/storeStats";
import {
  StoreStatsSettingsCard,
  StoreStatsUI,
  defaultStoreStatsUI,
} from "../../components/store-appearance/StoreStatsSettings";

/* ---------- Store Delivery Info ---------- */
import { StoreDeliveryInfoSettings } from "../../../../shared/blocks/storeDeliveryInfo";

/* ---------- Flash Sale Hero ---------- */
import FlashSaleHeroSettingsCard, {
  defaultFlashSaleHeroUI,
  FlashSaleHeroUI,
} from "./FlashSaleHeroSettings";
import StoreDeliveryInfoSettingsCard, {
  defaultStoreDeliveryInfoUI,
  StoreDeliveryInfoUI,
} from "../../components/store-appearance/StoreDeliveryInfoSettings";

/* ---------- Deals / Coupons Rail (settings card component file) ---------- */
import MainCouponSettingsCard, {
  defaultMainCouponUI,
  MainCouponUI,
} from "./MainCouponSettings";

/* ---------- NEW: Offers / Collections (settings card) ---------- */
import OffersCollectionsSettingsCard, {
  defaultOffersCollectionsUI,
  OffersCollectionsUI,
} from "./OffersCollectionsSettings";

/* ---------------- Announcement Bar types & mappers ---------------- */
type AnnBarSettings = {
  enabled?: boolean;
  message?: string;
  section_background_color?: string;
  text_color?: string;
  visibility?: "all" | "desktop" | "mobile";
  marquee_enabled?: boolean;
  marquee_mode?: "bounce" | "loop";
  marquee_speed?: number;
  left_button_enabled?: boolean;
  left_button_show?: boolean;
  left_button_text?: string;
  left_button_label?: string;
  left_button_url?: string;
  left_button_href?: string;
  left_button_new_tab?: boolean;
  right_button_enabled?: boolean;
  right_button_show?: boolean;
  right_button_text?: string;
  right_button_label?: string;
  right_button_url?: string;
  right_button_href?: string;
  right_button_new_tab?: boolean;
  [key: string]: any;
};

const mapToHeaderSettings = (s: AnnBarSettings | undefined) => ({
  showAnnouncement: s?.enabled ?? true,
  message: s?.message ?? "this is announced bar test it out",
  barColor: s?.section_background_color ?? "#296fc2",
  fontColor: s?.text_color ?? "#FFFFFF",
  visibility: s?.visibility ?? "all",
  marqueeEnabled: s?.marquee_enabled ?? false,
  marqueeMode: (s?.marquee_mode as "bounce" | "loop") ?? "bounce",
  marqueeSpeed: typeof s?.marquee_speed === "number" ? s.marquee_speed : 5,
  leftBtnEnabled:
    typeof s?.left_button_enabled === "boolean"
      ? s.left_button_enabled
      : !!s?.left_button_show,
  leftBtnText: s?.left_button_text ?? s?.left_button_label ?? "",
  leftBtnUrl: s?.left_button_url ?? s?.left_button_href ?? "",
  leftBtnNewTab: s?.left_button_new_tab ?? true,
  rightBtnEnabled:
    typeof s?.right_button_enabled === "boolean"
      ? s.right_button_enabled
      : !!s?.right_button_show,
  rightBtnText: s?.right_button_text ?? s?.right_button_label ?? "",
  rightBtnUrl: s?.right_button_url ?? s?.right_button_href ?? "",
  rightBtnNewTab: s?.right_button_new_tab ?? true,

  showStoreLogo: true,
  storeLogo: "",
  showStoreName: true,
  storeName: "Nomi",
  contentAlignment: "center" as "left" | "center",
  favicon: "",
});

function mergeAnnBarSettings(
  existing: AnnBarSettings | undefined,
  ui: any
): AnnBarSettings {
  return {
    ...(existing || {}),
    enabled: !!ui.showAnnouncement,
    message: ui.message ?? "",
    section_background_color: ui.barColor ?? "#296fc2",
    text_color: ui.fontColor ?? "#FFFFFF",
    visibility: ui.visibility || "all",
    marquee_enabled: !!ui.marqueeEnabled,
    marquee_mode: ui.marqueeMode === "loop" ? "loop" : "bounce",
    marquee_speed: Number(ui.marqueeSpeed ?? 5),
    left_button_enabled: !!ui.leftBtnEnabled,
    left_button_show: !!ui.leftBtnEnabled,
    left_button_text: ui.leftBtnText || "",
    left_button_label: ui.leftBtnText || "",
    left_button_url: ui.leftBtnUrl || "",
    left_button_href: ui.leftBtnUrl || "",
    left_button_new_tab: !!ui.leftBtnNewTab,
    right_button_enabled: !!ui.rightBtnEnabled,
    right_button_show: !!ui.rightBtnEnabled,
    right_button_text: ui.rightBtnText || "",
    right_button_label: ui.rightBtnText || "",
    right_button_url: ui.rightBtnUrl || "",
    right_button_href: ui.rightBtnUrl || "",
    right_button_new_tab: !!ui.rightBtnNewTab,
  };
}

/* ---------------- Store Hero mappers ---------------- */
type StoreHeroServerSettings = {
  height_desktop_px?: number;
  height_mobile_px?: number;
  border_radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  background_image_url?: string;
  background_object_position?: string;
  overlay_color?: string;
  overlay_opacity?: number;
  visibility?: "all" | "desktop" | "mobile";
  title_text?: string;
  subtitle_text?: string;
  tagline_text?: string | string[];
};

const mapStoreHeroToUI = (s?: StoreHeroServerSettings): StoreHeroUI => ({
  ...defaultStoreHeroUI,
  enabled: true,
  bgUrl: s?.background_image_url || defaultStoreHeroUI.bgUrl,
  logoUrl: defaultStoreHeroUI.logoUrl,
  title: s?.title_text || defaultStoreHeroUI.title,
  subtitle: s?.subtitle_text || defaultStoreHeroUI.subtitle,
  tagline: Array.isArray(s?.tagline_text)
    ? s?.tagline_text
    : typeof s?.tagline_text === "string"
    ? [s.tagline_text]
    : defaultStoreHeroUI.tagline,
  heightDesktop: Number(
    s?.height_desktop_px ?? defaultStoreHeroUI.heightDesktop
  ),
  heightMobile: Number(s?.height_mobile_px ?? defaultStoreHeroUI.heightMobile),
  borderRadius:
    (s?.border_radius as StoreHeroUI["borderRadius"]) ??
    defaultStoreHeroUI.borderRadius,
  overlayColor: s?.overlay_color ?? defaultStoreHeroUI.overlayColor,
  overlayOpacity: Number(
    s?.overlay_opacity ?? defaultStoreHeroUI.overlayOpacity
  ),
});

const mergeStoreHeroFromUI = (
  existing: StoreHeroServerSettings | undefined,
  ui: StoreHeroUI
): StoreHeroServerSettings => ({
  ...(existing || {}),
  height_desktop_px: Number(ui.heightDesktop),
  height_mobile_px: Number(ui.heightMobile),
  border_radius: ui.borderRadius,
  background_image_url: ui.bgUrl,
  overlay_color: ui.overlayColor,
  overlay_opacity: Number(ui.overlayOpacity),
  title_text: ui.title,
  subtitle_text: ui.subtitle,
  tagline_text: ui.tagline,
});

/* ---------------- Store Stats mappers ---------------- */
type StoreStatsServerSettings = StoreStatsSettings;

const mapStoreStatsToUI = (s?: StoreStatsServerSettings): StoreStatsUI => ({
  ...defaultStoreStatsUI,
  alignment: s?.alignment ?? defaultStoreStatsUI.alignment,
  compact: s?.compact ?? defaultStoreStatsUI.compact,
  show_dividers: s?.show_dividers ?? defaultStoreStatsUI.show_dividers,
  text_color: s?.text_color ?? defaultStoreStatsUI.text_color,
  divider_color: s?.divider_color ?? defaultStoreStatsUI.divider_color,
  visibility: (s?.visibility as any) ?? defaultStoreStatsUI.visibility,
  rating_enabled: s?.rating_enabled ?? defaultStoreStatsUI.rating_enabled,
  rating_value: Number(s?.rating_value ?? defaultStoreStatsUI.rating_value),
  rating_count: Number(s?.rating_count ?? defaultStoreStatsUI.rating_count),
  orders_enabled: s?.orders_enabled ?? defaultStoreStatsUI.orders_enabled,
  orders_value: String(s?.orders_value ?? defaultStoreStatsUI.orders_value),
  loves_enabled: s?.loves_enabled ?? defaultStoreStatsUI.loves_enabled,
  loves_value: Number(s?.loves_value ?? defaultStoreStatsUI.loves_value),
  custom1_enabled: s?.custom1_enabled ?? defaultStoreStatsUI.custom1_enabled,
  custom1_icon: s?.custom1_icon ?? defaultStoreStatsUI.custom1_icon,
  custom1_label: s?.custom1_label ?? defaultStoreStatsUI.custom1_label,
  custom1_value: s?.custom1_value ?? defaultStoreStatsUI.custom1_value,
  custom2_enabled: s?.custom2_enabled ?? defaultStoreStatsUI.custom2_enabled,
  custom2_icon: s?.custom2_icon ?? defaultStoreStatsUI.custom2_icon,
  custom2_label: s?.custom2_label ?? defaultStoreStatsUI.custom2_label,
  custom2_value: s?.custom2_value ?? defaultStoreStatsUI.custom2_value,
  custom_css: s?.custom_css ?? defaultStoreStatsUI.custom_css,
});

const mergeStoreStatsFromUI = (
  existing: StoreStatsServerSettings | undefined,
  ui: StoreStatsUI
): StoreStatsServerSettings => ({
  ...(existing || {}),
  alignment: ui.alignment,
  compact: ui.compact,
  show_dividers: ui.show_dividers,
  text_color: ui.text_color,
  divider_color: ui.divider_color,
  visibility: ui.visibility,
  rating_enabled: ui.rating_enabled,
  rating_value: Number(ui.rating_value),
  rating_count: Number(ui.rating_count),
  orders_enabled: ui.orders_enabled,
  orders_value: ui.orders_value,
  loves_enabled: ui.loves_enabled,
  loves_value: Number(ui.loves_value),
  custom1_enabled: ui.custom1_enabled,
  custom1_icon: ui.custom1_icon,
  custom1_label: ui.custom1_label,
  custom1_value: ui.custom1_value,
  custom2_enabled: ui.custom2_enabled,
  custom2_icon: ui.custom2_icon,
  custom2_label: ui.custom2_label,
  custom2_value: ui.custom2_value,
  custom_css: ui.custom_css,
});

/* ---------------- Delivery Info mappers ---------------- */
type StoreDeliveryServerSettings = StoreDeliveryInfoSettings;

const mapDeliveryToUI = (
  s?: StoreDeliveryServerSettings
): StoreDeliveryInfoUI => ({
  ...defaultStoreDeliveryInfoUI,
  background_color:
    s?.background_color ?? defaultStoreDeliveryInfoUI.background_color,
  text_color: s?.text_color ?? defaultStoreDeliveryInfoUI.text_color,
  accent_color: s?.accent_color ?? defaultStoreDeliveryInfoUI.accent_color,
  align: (s?.align as any) ?? defaultStoreDeliveryInfoUI.align,
  show_dividers: s?.show_dividers ?? defaultStoreDeliveryInfoUI.show_dividers,
  min_days: Number(s?.min_days ?? defaultStoreDeliveryInfoUI.min_days),
  max_days: Number(s?.max_days ?? defaultStoreDeliveryInfoUI.max_days),
  store_name: s?.store_name ?? defaultStoreDeliveryInfoUI.store_name,
  custom_css: s?.custom_css ?? defaultStoreDeliveryInfoUI.custom_css,
  visibility: (s?.visibility as any) ?? defaultStoreDeliveryInfoUI.visibility,
});

const mergeDeliveryFromUI = (
  existing: StoreDeliveryServerSettings | undefined,
  ui: StoreDeliveryInfoUI
): StoreDeliveryServerSettings => ({
  ...(existing || {}),
  background_color: ui.background_color,
  text_color: ui.text_color,
  accent_color: ui.accent_color,
  align: ui.align,
  show_dividers: ui.show_dividers,
  min_days: Number(ui.min_days),
  max_days: Number(ui.max_days),
  store_name: ui.store_name,
  custom_css: ui.custom_css,
  visibility: ui.visibility,
});

/* ---------------- Social Proof Strip (inline UI card + mappers) ---------------- */
type SocialSlot = {
  enabled?: boolean;
  platform?: string;
  value?: string;
  label?: string;
  href?: string;
  icon?: string;
  icon_img?: string;
  icon_bg?: string;
  icon_color?: string;
};

type SocialProofServerSettings = {
  enabled?: boolean;
  section_background_color?: string;
  compact?: boolean;
  max_items?: number;

  chip_radius?: number;
  chip_background_color?: string;
  chip_border_color?: string;
  chip_shadow?: boolean;
  hover_lift?: boolean;

  icon_size?: number;
  icon_pad?: number;
  icon_radius?: number;

  item1?: SocialSlot;
  item2?: SocialSlot;
  item3?: SocialSlot;
  item4?: SocialSlot;
  item5?: SocialSlot;
  items?: SocialSlot[];

  visibility?: "all" | "desktop" | "mobile";
  custom_css?: string | null;
};

type SocialProofUI = {
  enabled: boolean;
  section_background_color: string;
  compact: boolean;
  max_items: number;

  chip_radius: number;
  chip_background_color: string;
  chip_border_color: string;
  chip_shadow: boolean;
  hover_lift: boolean;

  icon_size: number;
  icon_pad: number;
  icon_radius: number;

  // editing path: prefer array editing; optionally force using it
  use_items_array: boolean;
  items_json: string;

  visibility: "all" | "desktop" | "mobile";
  custom_css: string | null;
};

const defaultSocialProofUI: SocialProofUI = {
  enabled: true,
  section_background_color: "#ffffff",
  compact: true,
  max_items: 5,

  chip_radius: 18,
  chip_background_color: "#ffffff",
  chip_border_color: "#ECEFF3",
  chip_shadow: true,
  hover_lift: true,

  icon_size: 20,
  icon_pad: 10,
  icon_radius: 12,

  use_items_array: false,
  items_json: JSON.stringify(
    [
      {
        enabled: true,
        platform: "Instagram",
        value: "64.1K",
        label: "Followers",
        href: "https://instagram.com/",
        icon_img:
          "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        icon_bg: "linear-gradient(135deg,#F9CE34 0%,#EE2A7B 50%,#6228D7 100%)",
        icon_color: "#ffffff",
      },
      {
        enabled: true,
        platform: "YouTube",
        value: "64.1K",
        label: "Followers",
        href: "https://youtube.com/",
        icon_img:
          "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
        icon_bg: "#FF0000",
        icon_color: "#ffffff",
      },
      {
        enabled: true,
        platform: "Facebook",
        value: "40K+",
        label: "Followers",
        href: "https://facebook.com/",
        icon_img:
          "https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg",
        icon_bg: "#1877F2",
        icon_color: "#ffffff",
      },
      {
        enabled: true,
        platform: "Podcasts",
        value: "20+",
        label: "Podcasts",
        icon_img:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23111827'><path d='M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z'/><path d='M5 11a1 1 0 1 0-2 0c0 4.08 3.06 7.44 7 7.93V22h4v-3.07c3.94-.49 7-3.85 7-7.93a1 1 0 1 0-2 0 6 6 0 0 1-12 0z'/></svg>",
        icon_bg: "#F59E0B",
        icon_color: "#111827",
      },
    ],
    null,
    2
  ),

  visibility: "all",
  custom_css: null,
};

const mapSocialProofToUI = (s?: SocialProofServerSettings): SocialProofUI => {
  const itemsArr = Array.isArray(s?.items) ? s?.items : [];
  return {
    ...defaultSocialProofUI,
    enabled: s?.enabled ?? defaultSocialProofUI.enabled,
    section_background_color:
      s?.section_background_color ??
      defaultSocialProofUI.section_background_color,
    compact: s?.compact ?? defaultSocialProofUI.compact,
    max_items: s?.max_items ?? defaultSocialProofUI.max_items,

    chip_radius: s?.chip_radius ?? defaultSocialProofUI.chip_radius,
    chip_background_color:
      s?.chip_background_color ?? defaultSocialProofUI.chip_background_color,
    chip_border_color:
      s?.chip_border_color ?? defaultSocialProofUI.chip_border_color,
    chip_shadow: s?.chip_shadow ?? defaultSocialProofUI.chip_shadow,
    hover_lift: s?.hover_lift ?? defaultSocialProofUI.hover_lift,

    icon_size: s?.icon_size ?? defaultSocialProofUI.icon_size,
    icon_pad: s?.icon_pad ?? defaultSocialProofUI.icon_pad,
    icon_radius: s?.icon_radius ?? defaultSocialProofUI.icon_radius,

    use_items_array: itemsArr.length > 0, // if theme already stores array
    items_json:
      itemsArr.length > 0
        ? JSON.stringify(itemsArr, null, 2)
        : defaultSocialProofUI.items_json,

    visibility: (s?.visibility as any) ?? defaultSocialProofUI.visibility,
    custom_css: s?.custom_css ?? defaultSocialProofUI.custom_css,
  };
};

const mergeSocialProofFromUI = (
  existing: SocialProofServerSettings | undefined,
  ui: SocialProofUI
): SocialProofServerSettings => {
  const out: SocialProofServerSettings = {
    ...(existing || {}),
    enabled: !!ui.enabled,
    section_background_color: ui.section_background_color,
    compact: !!ui.compact,
    max_items: Number(ui.max_items),
    chip_radius: Number(ui.chip_radius),
    chip_background_color: ui.chip_background_color,
    chip_border_color: ui.chip_border_color,
    chip_shadow: !!ui.chip_shadow,
    hover_lift: !!ui.hover_lift,
    icon_size: Number(ui.icon_size),
    icon_pad: Number(ui.icon_pad),
    icon_radius: Number(ui.icon_radius),
    visibility: ui.visibility,
    custom_css: ui.custom_css,
  };

  if (ui.use_items_array) {
    try {
      const arr = JSON.parse(ui.items_json || "[]");
      if (Array.isArray(arr)) {
        out.items = arr;
        // disable explicit slots if array is used
        out.item1 = { ...(existing?.item1 || {}), enabled: false };
        out.item2 = { ...(existing?.item2 || {}), enabled: false };
        out.item3 = { ...(existing?.item3 || {}), enabled: false };
        out.item4 = { ...(existing?.item4 || {}), enabled: false };
        out.item5 = { ...(existing?.item5 || {}), enabled: false };
      }
    } catch {
      // ignore parse errors
    }
  }

  return out;
};

// Minimal, inline settings card for Social Proof (unchanged UI)
const SocialProofStripSettingsCard: React.FC<{
  ui: SocialProofUI;
  onChange: (next: SocialProofUI) => void;
}> = ({ ui, onChange }) => {
  const s = { ...defaultSocialProofUI, ...(ui || {}) };
  const set = (patch: Partial<SocialProofUI>) => onChange({ ...s, ...patch });

  const [itemsText, setItemsText] = useState<string>(s.items_json);
  const [err, setErr] = useState<string | null>(null);

  const applyItems = () => {
    try {
      const arr = JSON.parse(itemsText);
      if (!Array.isArray(arr)) throw new Error("Must be an array");
      set({ items_json: JSON.stringify(arr, null, 2) });
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Invalid JSON");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Social Proof Strip</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.enabled}
            onChange={(e) => set({ enabled: e.target.checked })}
          />
          Enabled
        </label>
      </div>

      {/* Display */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <label className="block text-sm mb-1">Section background</label>
          <input
            type="color"
            className="w-full h-10 p-1 border rounded"
            value={s.section_background_color}
            onChange={(e) => set({ section_background_color: e.target.value })}
          />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.compact}
              onChange={(e) => set({ compact: e.target.checked })}
            />
            Compact
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span>Max items</span>
            <input
              type="number"
              min={1}
              max={5}
              className="w-20 border rounded px-2 py-1"
              value={s.max_items}
              onChange={(e) => set({ max_items: Number(e.target.value) || 5 })}
            />
          </div>
        </div>
      </div>

      {/* Card style */}
      <div>
        <h4 className="font-medium mb-3">Card style</h4>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1">Radius (px)</label>
            <input
              type="number"
              min={0}
              max={24}
              className="w-full border rounded px-3 py-2"
              value={s.chip_radius}
              onChange={(e) =>
                set({ chip_radius: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Card background</label>
            <input
              type="color"
              className="w-full h-10 p-1 border rounded"
              value={s.chip_background_color}
              onChange={(e) => set({ chip_background_color: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Border color</label>
            <input
              type="color"
              className="w-full h-10 p-1 border rounded"
              value={s.chip_border_color}
              onChange={(e) => set({ chip_border_color: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.chip_shadow}
                onChange={(e) => set({ chip_shadow: e.target.checked })}
              />
              Soft shadow
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.hover_lift}
                onChange={(e) => set({ hover_lift: e.target.checked })}
              />
              Hover lift
            </label>
          </div>
        </div>
      </div>

      {/* Icon style */}
      <div>
        <h4 className="font-medium mb-3">Icon style</h4>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1">Icon size (px)</label>
            <input
              type="number"
              min={12}
              max={32}
              className="w-full border rounded px-3 py-2"
              value={s.icon_size}
              onChange={(e) => set({ icon_size: Number(e.target.value) || 20 })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Icon padding (px)</label>
            <input
              type="number"
              min={6}
              max={16}
              className="w-full border rounded px-3 py-2"
              value={s.icon_pad}
              onChange={(e) => set({ icon_pad: Number(e.target.value) || 10 })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Icon radius (px)</label>
            <input
              type="number"
              min={0}
              max={20}
              className="w-full border rounded px-3 py-2"
              value={s.icon_radius}
              onChange={(e) =>
                set({ icon_radius: Number(e.target.value) || 12 })
              }
            />
          </div>
        </div>
      </div>

      {/* Items JSON */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.use_items_array}
            onChange={(e) => set({ use_items_array: e.target.checked })}
          />
          Use items[] array (disables explicit item1–item5)
        </label>
        <textarea
          className="w-full border rounded px-3 py-2 font-mono text-xs"
          rows={10}
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            onClick={applyItems}
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
          >
            Apply
          </button>
          {err ? <span className="text-red-600 text-sm">{err}</span> : null}
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

/* ------------------------------ Page ------------------------------ */
interface AddStoreDiplaySettingPageProps {
  section?: string;
}

const AddStoreDiplaySettingPage: React.FC<
  AddStoreDiplaySettingPageProps
> = () => {
  const [selectedTab, setSelectedTab] = useState<
    | "general"
    | "header"
    | "flash"
    | "offers"
    | "deals"
    | "stats"
    | "delivery"
    | "footer"
    | "about"
    | "terms"
  >("general");
  const formContainerRef = useRef<HTMLDivElement>(null!);

  const { userDetails } = useAuth();
  const businessIdFromAuth = userDetails?.storeLinks?.[0]?.businessId ?? null;

  const { data: myStore, isFetching: loadingStore } = useGetMyStoreDetailsQuery(
    undefined,
    { skip: !!businessIdFromAuth }
  );

  const businessStoreId =
    businessIdFromAuth ||
    (myStore as any)?.businessStoreId ||
    (myStore as any)?.id ||
    null;

  /* -------- general UI -------- */
  const [generalSettings, setGeneralSettings] = useState({
    font: "Inter, ui-sans-serif, system-ui",
    themeColor: "#29A56C",
    borderRadius: "12px",
    addToCart: true,
    buyNow: false,
    showWhatsApp: true,
  });

  /* -------- announcement UI -------- */
  const [headerSettings, setHeaderSettings] = useState<any>({
    showAnnouncement: true,
    message: "this is announced bar test it out",
    barColor: "#FFFFFF",
    fontColor: "#111827",
    visibility: "all",
    marqueeEnabled: false,
    marqueeMode: "bounce",
    marqueeSpeed: 5,
    leftBtnEnabled: false,
    leftBtnText: "",
    leftBtnUrl: "",
    leftBtnNewTab: true,
    rightBtnEnabled: false,
    rightBtnText: "",
    rightBtnUrl: "",
    rightBtnNewTab: true,
    showStoreLogo: true,
    storeLogo: "",
    showStoreName: true,
    storeName: "Nomi",
    contentAlignment: "center",
    favicon: "",
  });

  /* -------- top_nav UI -------- */
  type MenuUI = ReturnType<typeof mapTopNavToUI> & { enabled?: boolean };
  const [menuSettings, setMenuSettings] = useState<MenuUI>({
    ...mapTopNavToUI({}),
    enabled: true,
  });

  /* -------- store hero UI -------- */
  const [storeHeroUi, setStoreHeroUi] =
    useState<StoreHeroUI>(defaultStoreHeroUI);

  /* -------- flash sale hero UI -------- */
  const [flashSaleUi, setFlashSaleUi] = useState<FlashSaleHeroUI>(
    defaultFlashSaleHeroUI
  );

  /* -------- NEW: offers / collections UI -------- */
  const [offersUi, setOffersUi] = useState<OffersCollectionsUI>(
    defaultOffersCollectionsUI
  );

  /* -------- store stats UI -------- */
  const [storeStatsUi, setStoreStatsUi] =
    useState<StoreStatsUI>(defaultStoreStatsUI);

  /* -------- social proof strip UI -------- */
  const [socialProofUi, setSocialProofUi] =
    useState<SocialProofUI>(defaultSocialProofUI);

  /* -------- deals / coupons rail UI -------- */
  const [mainCouponUi, setMainCouponUi] =
    useState<MainCouponUI>(defaultMainCouponUI);

  /* -------- delivery info UI -------- */
  const [storeDeliveryUi, setStoreDeliveryUi] = useState<StoreDeliveryInfoUI>(
    defaultStoreDeliveryInfoUI
  );

  /* -------- policies UI -------- */
  interface PolicySettings {
    termsText: string;
    shippingPolicy: string;
    paymentPolicy: string;
    returnPolicy: string;
    privacyPolicy: string;
  }
  const [policySettings, setPolicySettings] = useState<PolicySettings>({
    termsText: "",
    shippingPolicy: "",
    paymentPolicy: "",
    returnPolicy: "",
    privacyPolicy: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* --------------------------- LOAD DATA --------------------------- */
  const { data: storefront, isFetching: loadingRuntime } =
    useGetStorefrontDataQuery(
      { businessStoreId: businessStoreId || "" },
      { skip: !businessStoreId }
    );

  const { data: themeData, isFetching: loadingTheme } = useGetCurrentThemeQuery(
    { businessStoreId: businessStoreId || "" },
    { skip: !businessStoreId }
  );

  // announcement
  const annFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "announcement_bar");
  }, [storefront]);
  const annFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "announcement_bar");
  }, [themeData]);
  const originalAnnSettings = useMemo<AnnBarSettings>(() => {
    try {
      if (annFromRuntime?.settings)
        return annFromRuntime.settings as AnnBarSettings;
      if (!annFromTheme) return {};
      return typeof annFromTheme.settings === "string"
        ? JSON.parse(annFromTheme.settings || "{}")
        : (annFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [annFromRuntime?.settings, annFromTheme]);
  useEffect(() => {
    setHeaderSettings((prev: any) => ({
      ...prev,
      ...mapToHeaderSettings(originalAnnSettings),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annFromRuntime?.id, annFromTheme?.id]);

  // top_nav
  const topNavFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "top_nav");
  }, [storefront]);
  const topNavFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "top_nav");
  }, [themeData]);
  const originalTopNavSettings = useMemo<any>(() => {
    try {
      if (topNavFromRuntime?.settings) return topNavFromRuntime.settings;
      if (!topNavFromTheme) return {};
      return typeof topNavFromTheme.settings === "string"
        ? JSON.parse(topNavFromTheme.settings || "{}")
        : (topNavFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [topNavFromRuntime?.settings, topNavFromTheme]);
  useEffect(() => {
    const uiFromSettings = mapTopNavToUI(originalTopNavSettings);
    const activeFlag =
      (typeof topNavFromRuntime?.is_active === "number"
        ? topNavFromRuntime.is_active
        : topNavFromTheme?.is_active) ?? 1;

    setMenuSettings({ ...uiFromSettings, enabled: activeFlag !== 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topNavFromRuntime?.id, topNavFromTheme?.id]);

  // store_hero
  const heroFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "store_hero");
  }, [storefront]);
  const heroFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "store_hero");
  }, [themeData]);
  const originalHeroSettings = useMemo<StoreHeroServerSettings>(() => {
    try {
      if (heroFromRuntime?.settings)
        return heroFromRuntime.settings as StoreHeroServerSettings;
      if (!heroFromTheme) return {};
      return typeof heroFromTheme.settings === "string"
        ? JSON.parse(heroFromTheme.settings || "{}")
        : (heroFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [heroFromRuntime?.settings, heroFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof heroFromRuntime?.is_active === "number"
        ? heroFromRuntime.is_active
        : heroFromTheme?.is_active) ?? 1;

    setStoreHeroUi({
      ...mapStoreHeroToUI(originalHeroSettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroFromRuntime?.id, heroFromTheme?.id]);

  // flash_sale_hero
  const flashFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "flash_sale_hero");
  }, [storefront]);

  const flashFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "flash_sale_hero");
  }, [themeData]);

  const originalFlashSettings = useMemo<any>(() => {
    try {
      if (flashFromRuntime?.settings) return flashFromRuntime.settings;
      if (!flashFromTheme) return {};
      return typeof flashFromTheme.settings === "string"
        ? JSON.parse(flashFromTheme.settings || "{}")
        : (flashFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [flashFromRuntime?.settings, flashFromTheme]);

  useEffect(() => {
    const activeFlag =
      (typeof flashFromRuntime?.is_active === "number"
        ? flashFromRuntime.is_active
        : flashFromTheme?.is_active) ?? 1;

    setFlashSaleUi({
      ...defaultFlashSaleHeroUI,
      ...(originalFlashSettings || {}),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashFromRuntime?.id, flashFromTheme?.id]);

  // NEW: offers_collections
  const offersFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "offers_collections");
  }, [storefront]);
  const offersFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "offers_collections");
  }, [themeData]);
  const originalOffersSettings = useMemo<any>(() => {
    try {
      if (offersFromRuntime?.settings) return offersFromRuntime.settings;
      if (!offersFromTheme) return {};
      return typeof offersFromTheme.settings === "string"
        ? JSON.parse(offersFromTheme.settings || "{}")
        : (offersFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [offersFromRuntime?.settings, offersFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof offersFromRuntime?.is_active === "number"
        ? offersFromRuntime.is_active
        : offersFromTheme?.is_active) ?? 1;

    setOffersUi({
      ...defaultOffersCollectionsUI,
      ...(originalOffersSettings || {}),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offersFromRuntime?.id, offersFromTheme?.id]);

  // store_stats
  const statsFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "store_stats");
  }, [storefront]);
  const statsFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "store_stats");
  }, [themeData]);
  const originalStatsSettings = useMemo<StoreStatsServerSettings>(() => {
    try {
      if (statsFromRuntime?.settings)
        return statsFromRuntime.settings as StoreStatsServerSettings;
      if (!statsFromTheme) return {};
      return typeof statsFromTheme.settings === "string"
        ? JSON.parse(statsFromTheme.settings || "{}")
        : (statsFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [statsFromRuntime?.settings, statsFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof statsFromRuntime?.is_active === "number"
        ? statsFromRuntime.is_active
        : statsFromTheme?.is_active) ?? 1;
    setStoreStatsUi({
      ...mapStoreStatsToUI(originalStatsSettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsFromRuntime?.id, statsFromTheme?.id]);

  // social_proof_strip
  const spsFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "social_proof_strip");
  }, [storefront]);
  const spsFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "social_proof_strip");
  }, [themeData]);
  const originalSpsSettings = useMemo<SocialProofServerSettings>(() => {
    try {
      if (spsFromRuntime?.settings)
        return spsFromRuntime.settings as SocialProofServerSettings;
      if (!spsFromTheme) return {};
      return typeof spsFromTheme.settings === "string"
        ? JSON.parse(spsFromTheme.settings || "{}")
        : (spsFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [spsFromRuntime?.settings, spsFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof spsFromRuntime?.is_active === "number"
        ? spsFromRuntime.is_active
        : spsFromTheme?.is_active) ?? 1;
    setSocialProofUi({
      ...mapSocialProofToUI(originalSpsSettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spsFromRuntime?.id, spsFromTheme?.id]);

  // main_coupon
  const couponFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "main_coupon");
  }, [storefront]);

  const couponFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "main_coupon");
  }, [themeData]);

  const originalCouponSettings = useMemo<any>(() => {
    try {
      if (couponFromRuntime?.settings) return couponFromRuntime.settings;
      if (!couponFromTheme) return {};
      return typeof couponFromTheme.settings === "string"
        ? JSON.parse(couponFromTheme.settings || "{}")
        : (couponFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [couponFromRuntime?.settings, couponFromTheme]);

  useEffect(() => {
    const activeFlag =
      (typeof couponFromRuntime?.is_active === "number"
        ? couponFromRuntime.is_active
        : couponFromTheme?.is_active) ?? 1;

    setMainCouponUi({
      ...defaultMainCouponUI,
      ...(originalCouponSettings || {}),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponFromRuntime?.id, couponFromTheme?.id]);

  // store_delivery_info
  const deliveryFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "store_delivery_info");
  }, [storefront]);
  const deliveryFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "store_delivery_info");
  }, [themeData]);
  const originalDeliverySettings = useMemo<StoreDeliveryServerSettings>(() => {
    try {
      if (deliveryFromRuntime?.settings)
        return deliveryFromRuntime.settings as StoreDeliveryServerSettings;
      if (!deliveryFromTheme) return {};
      return typeof deliveryFromTheme.settings === "string"
        ? JSON.parse(deliveryFromTheme.settings || "{}")
        : (deliveryFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [deliveryFromRuntime?.settings, deliveryFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof deliveryFromRuntime?.is_active === "number"
        ? deliveryFromRuntime.is_active
        : deliveryFromTheme?.is_active) ?? 1;

    setStoreDeliveryUi({
      ...mapDeliveryToUI(originalDeliverySettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryFromRuntime?.id, deliveryFromTheme?.id]);

  /* --------------------------- Mutations --------------------------- */
  const [createBlock, { isLoading: creating }] = useCreateBlockMutation();
  const [updateBlockMutation, { isLoading: updating }] =
    useUpdateBlockMutation();
  const [publishTheme, { isLoading: publishing }] = usePublishThemeMutation();

  const busy =
    loadingStore ||
    loadingRuntime ||
    loadingTheme ||
    creating ||
    updating ||
    publishing;

  /* ---------------------------------- SAVE ---------------------------------- */
  const handleSave = async () => {
    const themeId = (themeData as any)?.theme_details?.id;
    if (!businessStoreId || !themeId) {
      alert("Missing store or theme id");
      return;
    }

    try {
      // A) Announcement
      let annId =
        (annFromTheme?.id as string | undefined) ||
        (annFromRuntime?.id as string | undefined);
      const annPos =
        (annFromTheme?.position as number | undefined) ??
        (annFromRuntime?.position as number | undefined) ??
        1;

      if (!annId) {
        const created = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "announcement_bar",
            name: "Announcement Bar",
            is_active: headerSettings.showAnnouncement ? 1 : 0,
            position: Number(annPos) || 1,
            settings: mergeAnnBarSettings({}, headerSettings),
          },
        }).unwrap();
        annId = created.id;
      } else {
        await updateBlockMutation({
          id: annId,
          body: {
            name: annFromTheme?.name || "Announcement Bar",
            custom_name: (annFromTheme as any)?.custom_name || "",
            position: Number(annPos) || 1,
            is_active: headerSettings.showAnnouncement ? 1 : 0,
            settings: mergeAnnBarSettings(originalAnnSettings, headerSettings),
          },
        }).unwrap();
      }

      // B) Top Nav
      let navId =
        (topNavFromTheme?.id as string | undefined) ||
        (topNavFromRuntime?.id as string | undefined);
      const navPos =
        (topNavFromTheme?.position as number | undefined) ??
        (topNavFromRuntime?.position as number | undefined) ??
        2;

      const navSettingsPayload = mergeTopNavFromUI(
        originalTopNavSettings,
        menuSettings
      );

      if (!navId) {
        const createdNav = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "top_nav",
            name: "Menu",
            is_active: menuSettings?.enabled ? 1 : 0,
            position: Number(navPos) || 2,
            settings: navSettingsPayload,
          },
        }).unwrap();
        navId = createdNav.id;
      } else {
        await updateBlockMutation({
          id: navId,
          body: {
            name: topNavFromTheme?.name || "Menu",
            custom_name: (topNavFromTheme as any)?.custom_name || "",
            position: Number(navPos) || 2,
            is_active: menuSettings?.enabled ? 1 : 0,
            settings: navSettingsPayload,
          },
        }).unwrap();
      }

      // C) Store Hero
      let heroId =
        (heroFromTheme?.id as string | undefined) ||
        (heroFromRuntime?.id as string | undefined);
      const heroPos =
        (heroFromTheme?.position as number | undefined) ??
        (heroFromRuntime?.position as number | undefined) ??
        (typeof navPos === "number" ? navPos + 1 : 3);

      const heroSettingsPayload = mergeStoreHeroFromUI(
        originalHeroSettings,
        storeHeroUi
      );

      if (!heroId) {
        const createdHero = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "store_hero",
            name: "Store Hero",
            is_active: storeHeroUi.enabled ? 1 : 0,
            position: Number(heroPos) || 3,
            settings: heroSettingsPayload,
          },
        }).unwrap();
        heroId = createdHero.id;
      } else {
        await updateBlockMutation({
          id: heroId,
          body: {
            name: heroFromTheme?.name || "Store Hero",
            custom_name: (heroFromTheme as any)?.custom_name || "",
            position: Number(heroPos) || 3,
            is_active: storeHeroUi.enabled ? 1 : 0,
            settings: heroSettingsPayload,
          },
        }).unwrap();
      }

      // D) Flash Sale Hero (after Store Hero)
      let flashId =
        (flashFromTheme?.id as string | undefined) ||
        (flashFromRuntime?.id as string | undefined);

      const flashPos =
        (flashFromTheme?.position as number | undefined) ??
        (flashFromRuntime?.position as number | undefined) ??
        (typeof heroPos === "number" ? heroPos + 1 : 4);

      const flashSettingsPayload = {
        ...(originalFlashSettings || {}),
        ...(flashSaleUi as any),
      };

      if (!flashId) {
        const createdFlash = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "flash_sale_hero",
            name: "Flash Sale Hero",
            is_active: flashSaleUi.enabled ? 1 : 0,
            position: Number(flashPos) || 4,
            settings: flashSettingsPayload,
          },
        }).unwrap();
        flashId = createdFlash.id;
      } else {
        await updateBlockMutation({
          id: flashId,
          body: {
            name: flashFromTheme?.name || "Flash Sale Hero",
            custom_name: (flashFromTheme as any)?.custom_name || "",
            position: Number(flashPos) || 4,
            is_active: flashSaleUi.enabled ? 1 : 0,
            settings: flashSettingsPayload,
          },
        }).unwrap();
      }

      // E) NEW: Offers / Collections (after Flash Sale)
      let offersId =
        (offersFromTheme?.id as string | undefined) ||
        (offersFromRuntime?.id as string | undefined);

      const offersPos =
        (offersFromTheme?.position as number | undefined) ??
        (offersFromRuntime?.position as number | undefined) ??
        (typeof flashPos === "number" ? flashPos + 1 : 5);

      const offersSettingsPayload = {
        ...(originalOffersSettings || {}),
        ...(offersUi as any),
      };

      if (!offersId) {
        const createdOffers = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "offers_collections",
            name: "Offers / Collections",
            is_active: offersUi.enabled ? 1 : 0,
            position: Number(offersPos) || 5,
            settings: offersSettingsPayload,
          },
        }).unwrap();
        offersId = createdOffers.id;
      } else {
        await updateBlockMutation({
          id: offersId,
          body: {
            name: offersFromTheme?.name || "Offers / Collections",
            custom_name: (offersFromTheme as any)?.custom_name || "",
            position: Number(offersPos) || 5,
            is_active: offersUi.enabled ? 1 : 0,
            settings: offersSettingsPayload,
          },
        }).unwrap();
      }

      // F) Store Stats (after Offers)
      let statsId =
        (statsFromTheme?.id as string | undefined) ||
        (statsFromRuntime?.id as string | undefined);
      const statsPos =
        (statsFromTheme?.position as number | undefined) ??
        (statsFromRuntime?.position as number | undefined) ??
        (typeof offersPos === "number" ? offersPos + 1 : 6);

      const statsSettingsPayload = mergeStoreStatsFromUI(
        originalStatsSettings,
        storeStatsUi
      );

      if (!statsId) {
        const createdStats = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "store_stats",
            name: "Store Stats",
            is_active: storeStatsUi.enabled ? 1 : 0,
            position: Number(statsPos) || 6,
            settings: statsSettingsPayload,
          },
        }).unwrap();
        statsId = createdStats.id;
      } else {
        await updateBlockMutation({
          id: statsId,
          body: {
            name: statsFromTheme?.name || "Store Stats",
            custom_name: (statsFromTheme as any)?.custom_name || "",
            position: Number(statsPos) || 6,
            is_active: storeStatsUi.enabled ? 1 : 0,
            settings: statsSettingsPayload,
          },
        }).unwrap();
      }

      // G) Social Proof Strip (after Store Stats)
      let spsId =
        (spsFromTheme?.id as string | undefined) ||
        (spsFromRuntime?.id as string | undefined);

      const spsPos =
        (spsFromTheme?.position as number | undefined) ??
        (spsFromRuntime?.position as number | undefined) ??
        (typeof statsPos === "number" ? statsPos + 1 : 7);

      const spsSettingsPayload = mergeSocialProofFromUI(
        originalSpsSettings,
        socialProofUi
      );

      if (!spsId) {
        const createdSps = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "social_proof_strip",
            name: "Social Proof Strip",
            is_active: socialProofUi.enabled ? 1 : 0,
            position: Number(spsPos) || 7,
            settings: spsSettingsPayload,
          },
        }).unwrap();
        spsId = createdSps.id;
      } else {
        await updateBlockMutation({
          id: spsId,
          body: {
            name: spsFromTheme?.name || "Social Proof Strip",
            custom_name: (spsFromTheme as any)?.custom_name || "",
            position: Number(spsPos) || 7,
            is_active: socialProofUi.enabled ? 1 : 0,
            settings: spsSettingsPayload,
          },
        }).unwrap();
      }

      // H) Deals / Coupons Rail (after Social Proof)
      let couponId =
        (couponFromTheme?.id as string | undefined) ||
        (couponFromRuntime?.id as string | undefined);

      const couponPos =
        (couponFromTheme?.position as number | undefined) ??
        (couponFromRuntime?.position as number | undefined) ??
        (typeof spsPos === "number"
          ? spsPos + 1
          : typeof statsPos === "number"
          ? statsPos + 1
          : 8);

      const couponSettingsPayload = {
        ...(originalCouponSettings || {}),
        ...(mainCouponUi as any),
      };

      if (!couponId) {
        const createdCoupon = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "main_coupon",
            name: "Deals / Coupons Rail",
            is_active: mainCouponUi.enabled ? 1 : 0,
            position: Number(couponPos) || 8,
            settings: couponSettingsPayload,
          },
        }).unwrap();
        couponId = createdCoupon.id;
      } else {
        await updateBlockMutation({
          id: couponId,
          body: {
            name: couponFromTheme?.name || "Deals / Coupons Rail",
            custom_name: (couponFromTheme as any)?.custom_name || "",
            position: Number(couponPos) || 8,
            is_active: mainCouponUi.enabled ? 1 : 0,
            settings: couponSettingsPayload,
          },
        }).unwrap();
      }

      // I) Store Delivery Info
      let deliveryId =
        (deliveryFromTheme?.id as string | undefined) ||
        (deliveryFromRuntime?.id as string | undefined);
      const deliveryPos =
        (deliveryFromTheme?.position as number | undefined) ??
        (deliveryFromRuntime?.position as number | undefined) ??
        (typeof couponPos === "number" ? couponPos + 1 : 9);

      const deliverySettingsPayload = mergeDeliveryFromUI(
        originalDeliverySettings,
        storeDeliveryUi
      );

      if (!deliveryId) {
        const createdDelivery = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "store_delivery_info",
            name: "Store Delivery Info",
            is_active: storeDeliveryUi.enabled ? 1 : 0,
            position: Number(deliveryPos) || 9,
            settings: deliverySettingsPayload,
          },
        }).unwrap();
        deliveryId = createdDelivery.id;
      } else {
        await updateBlockMutation({
          id: deliveryId,
          body: {
            name: deliveryFromTheme?.name || "Store Delivery Info",
            custom_name: (deliveryFromTheme as any)?.custom_name || "",
            position: Number(deliveryPos) || 9,
            is_active: storeDeliveryUi.enabled ? 1 : 0,
            settings: deliverySettingsPayload,
          },
        }).unwrap();
      }

      // Publish
      await publishTheme({ businessStoreId }).unwrap();
    } catch (e: any) {
      const data = e?.data || e?.response?.data;
      alert(data?.error || data?.message || e?.message || "Save failed");
    }
  };

  const handleCancel = () => window.location.reload();

  /* ------------------------------ Tabs ------------------------------ */
  const renderTab = () => {
    switch (selectedTab) {
      case "general":
        return (
          <GeneralSettings
            generalSettings={generalSettings}
            onChange={setGeneralSettings}
          />
        );
      case "header":
        return (
          <>
            <HeaderSettings
              headerSettings={headerSettings}
              onChange={setHeaderSettings}
            />
            {/* Keep the enabled flag in our state */}
            <TopNavSettingsCard
              ui={menuSettings}
              onChange={(ui) => setMenuSettings((prev) => ({ ...prev, ...ui }))}
            />
            <StoreHeroSettingsCard ui={storeHeroUi} onChange={setStoreHeroUi} />
          </>
        );
      case "flash":
        return (
          <FlashSaleHeroSettingsCard
            ui={flashSaleUi}
            onChange={setFlashSaleUi}
          />
        );
      case "offers":
        return (
          <OffersCollectionsSettingsCard ui={offersUi} onChange={setOffersUi} />
        );
      case "deals":
        return (
          <MainCouponSettingsCard
            ui={mainCouponUi}
            onChange={setMainCouponUi}
          />
        );
      case "stats":
        return (
          <>
            <StoreStatsSettingsCard
              ui={storeStatsUi}
              onChange={setStoreStatsUi}
            />
            <SocialProofStripSettingsCard
              ui={socialProofUi}
              onChange={setSocialProofUi}
            />
          </>
        );
      case "delivery":
        return (
          <StoreDeliveryInfoSettingsCard
            ui={storeDeliveryUi}
            onChange={setStoreDeliveryUi}
          />
        );
      case "terms":
        return (
          <TermsOfServiceSettings
            policySettings={policySettings}
            onChange={setPolicySettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout role={UserRoleName.SELLER}>
      <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden flex-col md:flex-row">
        {/* Left Settings Panel */}
        <div className="w-full md:w-[50%] flex flex-col p-6 bg-white border-r border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 mb-6 text-sm font-semibold text-gray-700">
            {[
              { label: "General", key: "general" },
              { label: "Header", key: "header" },
              { label: "Flash Sale", key: "flash" },
              { label: "Offers", key: "offers" }, // NEW
              { label: "Deals", key: "deals" },
              { label: "Social Stats", key: "stats" },
              { label: "Delivery Info", key: "delivery" },
              { label: "Footer", key: "footer" },
              { label: "About Us", key: "about" },
              { label: "Terms Of Service", key: "terms" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`relative pb-3 transition-all duration-200 ${
                  selectedTab === (tab.key as any)
                    ? "text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Form Section */}
          <div
            ref={formContainerRef}
            className="flex-1 overflow-y-auto pr-2 space-y-6 pb-16"
          >
            {renderTab()}

            {/* Actions */}
            <div className="bottom-0 bg-white pt-4 pb-6 flex justify-end gap-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                disabled={busy || !businessStoreId || !themeData}
                title={!businessStoreId ? "No store id" : ""}
              >
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="hidden md:block w-[50%] p-6 bg-gradient-to-b from-gray-50 to-white overflow-y-auto shadow-inner rounded-l-lg">
          <StorePreview
            generalSettings={generalSettings}
            headerSettings={headerSettings}
            runtimeLayout={storefront?.layout || []}
            topNavUi={menuSettings}
            storeHeroUi={storeHeroUi}
            flashSaleUi={flashSaleUi}
            storeStatsUi={storeStatsUi}
            storeDeliveryUi={storeDeliveryUi}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddStoreDiplaySettingPage;
