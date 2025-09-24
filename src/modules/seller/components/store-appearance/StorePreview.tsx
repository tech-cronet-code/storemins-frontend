/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { RenderLayout } from "../../../../shared/blocks/registry";
import { mergeAnnBarFromUI } from "../../../../shared/blocks/announcementBar";
import { mergeTopNavFromUI } from "../../../../shared/blocks/topNav";
import { StoreStatsSettings } from "../../../../shared/blocks/storeStats";
import { StoreDeliveryInfoSettings } from "../../../../shared/blocks/storeDeliveryInfo";
import { FlashSaleHeroServerSettings } from "../../pages/store-appearance/FlashSaleHeroSettings";

/** ---- Store Hero merge ---- */
const mergeStoreHeroFromUI = (existing: any, ui: any) => ({
  ...(existing || {}),
  background_image_url: ui?.bgUrl ?? existing?.background_image_url,
  logo_image_url: ui?.logoUrl ?? existing?.logo_image_url,
  title_text: ui?.title ?? existing?.title_text,
  subtitle_text: ui?.subtitle ?? existing?.subtitle_text,
  tagline_text: Array.isArray(ui?.tagline)
    ? ui?.tagline
    : existing?.tagline_text,
  height_desktop_px: Number(
    ui?.heightDesktop ?? existing?.height_desktop_px ?? 400
  ),
  height_mobile_px: Number(
    ui?.heightMobile ?? existing?.height_mobile_px ?? 240
  ),
  border_radius: ui?.borderRadius ?? existing?.border_radius ?? "lg",
  overlay_color: ui?.overlayColor ?? existing?.overlay_color ?? "#000000",
  overlay_opacity: Number(
    ui?.overlayOpacity ?? existing?.overlay_opacity ?? 20
  ),
});

/** ---- Flash Sale Hero merge ---- */
const mergeFlashSaleHeroFromUI = (
  existing: Partial<FlashSaleHeroServerSettings> | undefined,
  ui: Partial<FlashSaleHeroServerSettings>
): FlashSaleHeroServerSettings => ({
  ...(existing || {}),
  ...(ui || {}),
});

/** ---- Store Stats merge ---- */
const mergeStoreStatsFromUI = (
  existing: Partial<StoreStatsSettings> | undefined,
  ui: Partial<StoreStatsSettings>
): StoreStatsSettings => ({
  alignment: ui.alignment ?? existing?.alignment ?? "center",
  compact: ui.compact ?? existing?.compact ?? true,
  show_dividers: ui.show_dividers ?? existing?.show_dividers ?? true,
  text_color: ui.text_color ?? existing?.text_color ?? "#111827",
  divider_color: ui.divider_color ?? existing?.divider_color ?? "#E5E7EB",
  visibility: ui.visibility ?? existing?.visibility ?? "all",

  rating_enabled: ui.rating_enabled ?? existing?.rating_enabled ?? true,
  rating_value: Number(ui.rating_value ?? existing?.rating_value ?? 4.42),
  rating_count: Number(ui.rating_count ?? existing?.rating_count ?? 92),

  orders_enabled: ui.orders_enabled ?? existing?.orders_enabled ?? true,
  orders_value: String(ui.orders_value ?? existing?.orders_value ?? "1.5k"),

  loves_enabled: ui.loves_enabled ?? existing?.loves_enabled ?? true,
  loves_value: Number(ui.loves_value ?? existing?.loves_value ?? 279),

  custom1_enabled: ui.custom1_enabled ?? existing?.custom1_enabled ?? false,
  custom1_icon:
    ui.custom1_icon ?? existing?.custom1_icon ?? "ri-flashlight-line",
  custom1_label: ui.custom1_label ?? existing?.custom1_label ?? "New",
  custom1_value: ui.custom1_value ?? existing?.custom1_value ?? "",

  custom2_enabled: ui.custom2_enabled ?? existing?.custom2_enabled ?? false,
  custom2_icon:
    ui.custom2_icon ?? existing?.custom2_icon ?? "ri-shield-check-line",
  custom2_label: ui.custom2_label ?? existing?.custom2_label ?? "Trusted",
  custom2_value: ui.custom2_value ?? existing?.custom2_value ?? "",

  custom_css: ui.custom_css ?? existing?.custom_css ?? null,
});

/** ---- Delivery Info merge ---- */
const mergeDeliveryInfoFromUI = (
  existing: Partial<StoreDeliveryInfoSettings> | undefined,
  ui: Partial<StoreDeliveryInfoSettings>
): StoreDeliveryInfoSettings => ({
  background_color:
    ui.background_color ?? existing?.background_color ?? "#ffffff",
  text_color: ui.text_color ?? existing?.text_color ?? "#111827",
  accent_color: ui.accent_color ?? existing?.accent_color ?? "#7c3aed",
  align: (ui.align as any) ?? existing?.align ?? "left",
  show_dividers: ui.show_dividers ?? existing?.show_dividers ?? true,
  min_days: Number(ui.min_days ?? existing?.min_days ?? 1),
  max_days: Number(ui.max_days ?? existing?.max_days ?? 5),
  store_name: ui.store_name ?? existing?.store_name ?? "",
  custom_css: ui.custom_css ?? existing?.custom_css ?? null,
  visibility: (ui.visibility as any) ?? existing?.visibility ?? "all",
});

/** ---- Deals / Coupons Rail merge ---- */
const mergeMainCouponFromUI = (existing: any, ui: any) => ({
  ...(existing || {}),
  ...(ui || {}),
});

/** ---- Offers / Collections merge ---- */
const mergeOffersCollectionsFromUI = (existing: any, ui: any) => ({
  ...(existing || {}),
  ...(ui || {}),
});

interface StorePreviewProps {
  generalSettings: any;
  headerSettings: any;
  runtimeLayout?: any[];
  topNavUi?: any;
  storeHeroUi?: any;
  flashSaleUi?: Partial<FlashSaleHeroServerSettings> & { enabled?: boolean };
  storeStatsUi?: Partial<StoreStatsSettings> & { enabled?: boolean };
  storeDeliveryUi?: Partial<StoreDeliveryInfoSettings> & { enabled?: boolean };

  /** NEW: allow live enable/disable in preview */
  mainCouponUi?: any & { enabled?: boolean };
  offersUi?: any & { enabled?: boolean };
}

const StorePreview: React.FC<StorePreviewProps> = ({
  generalSettings,
  headerSettings,
  runtimeLayout = [],
  topNavUi,
  storeHeroUi,
  flashSaleUi,
  storeStatsUi,
  storeDeliveryUi,
  mainCouponUi,
  offersUi,
}) => {
  const previewLayout = useMemo(() => {
    const out: any[] = [];
    let hasAnn = false;
    let hasTopNav = false;
    let hasHero = false;
    let hasFlashSale = false;
    let hasStats = false;
    let hasDelivery = false;
    let hasCoupon = false;
    let hasOffers = false;

    let annPos: number | undefined;
    let navPos: number | undefined;
    let heroPos: number | undefined;
    let flashPos: number | undefined;
    let statsPos: number | undefined;
    let couponPos: number | undefined;
    let offersPos: number | undefined;

    for (const b of Array.isArray(runtimeLayout) ? runtimeLayout : []) {
      if (b?.code === "announcement_bar") {
        hasAnn = true;
        annPos = typeof b.position === "number" ? b.position : annPos;
        out.push({
          ...b,
          settings: mergeAnnBarFromUI(b.settings, headerSettings),
        });
      } else if (b?.code === "top_nav") {
        hasTopNav = true;
        navPos = typeof b.position === "number" ? b.position : navPos;
        out.push({
          ...b,
          settings: mergeTopNavFromUI(b.settings, topNavUi || {}),
          is_active: topNavUi?.enabled ?? true ? 1 : 0,
        });
      } else if (b?.code === "store_hero") {
        hasHero = true;
        heroPos = typeof b.position === "number" ? b.position : heroPos;
        out.push({
          ...b,
          settings: mergeStoreHeroFromUI(b.settings, storeHeroUi || {}),
          is_active: storeHeroUi?.enabled ?? true ? 1 : 0,
        });
      } else if (b?.code === "flash_sale_hero") {
        hasFlashSale = true;
        flashPos = typeof b.position === "number" ? b.position : flashPos;
        out.push({
          ...b,
          settings: mergeFlashSaleHeroFromUI(b.settings, flashSaleUi || {}),
          is_active: flashSaleUi?.enabled ?? true ? 1 : 0,
        });
      } else if (b?.code === "store_stats") {
        hasStats = true;
        statsPos = typeof b.position === "number" ? b.position : statsPos;
        out.push({
          ...b,
          settings: mergeStoreStatsFromUI(b.settings, storeStatsUi || {}),
          is_active: storeStatsUi?.enabled ?? true ? 1 : 0,
        });
      } else if (b?.code === "main_coupon") {
        hasCoupon = true;
        couponPos = typeof b.position === "number" ? b.position : couponPos;
        out.push({
          ...b,
          settings: mergeMainCouponFromUI(b.settings, mainCouponUi || {}),
          is_active: mainCouponUi?.enabled ?? true ? 1 : 0,
        });
      } else if (b?.code === "offers_collections") {
        hasOffers = true;
        offersPos = typeof b.position === "number" ? b.position : offersPos;
        out.push({
          ...b,
          settings: mergeOffersCollectionsFromUI(b.settings, offersUi || {}),
          is_active: offersUi?.enabled ?? true ? 1 : 0,
        });
      } else if (b?.code === "store_delivery_info") {
        hasDelivery = true;
        out.push({
          ...b,
          settings: mergeDeliveryInfoFromUI(b.settings, storeDeliveryUi || {}),
          is_active: storeDeliveryUi?.enabled ?? true ? 1 : 0,
        });
      } else {
        out.push({ ...b });
      }
    }

    // Ensure presence + positions for preview (so toggles reflect instantly)
    if (!hasTopNav) {
      navPos = typeof annPos === "number" ? annPos + 1 : 2;
      out.push({
        id: "preview-top_nav",
        code: "top_nav",
        position: navPos,
        is_active: topNavUi?.enabled ?? true ? 1 : 0,
        settings: mergeTopNavFromUI({}, topNavUi || {}),
      });
    }

    if (!hasHero) {
      heroPos = typeof navPos === "number" ? navPos + 1 : 3;
      out.push({
        id: "preview-store_hero",
        code: "store_hero",
        position: heroPos,
        is_active: storeHeroUi?.enabled ?? true ? 1 : 0,
        settings: mergeStoreHeroFromUI({}, storeHeroUi || {}),
      });
    }

    if (!hasFlashSale) {
      flashPos = typeof heroPos === "number" ? heroPos + 1 : 4;
      out.push({
        id: "preview-flash_sale_hero",
        code: "flash_sale_hero",
        position: flashPos,
        is_active: flashSaleUi?.enabled ?? true ? 1 : 0,
        settings: mergeFlashSaleHeroFromUI({}, flashSaleUi || {}),
      });
    }

    if (!hasStats) {
      statsPos = typeof flashPos === "number" ? flashPos + 1 : 5;
      out.push({
        id: "preview-store_stats",
        code: "store_stats",
        position: statsPos,
        is_active: storeStatsUi?.enabled ?? true ? 1 : 0,
        settings: mergeStoreStatsFromUI({}, storeStatsUi || {}),
      });
    }

    if (!hasOffers && offersUi) {
      offersPos =
        typeof statsPos === "number" ? statsPos + 1 : (offersPos as any) ?? 6;
      out.push({
        id: "preview-offers_collections",
        code: "offers_collections",
        position: offersPos,
        is_active: offersUi?.enabled ?? true ? 1 : 0,
        settings: mergeOffersCollectionsFromUI({}, offersUi || {}),
      });
    }

    if (!hasCoupon && mainCouponUi) {
      couponPos =
        typeof (offersPos ?? statsPos) === "number"
          ? (offersPos ?? statsPos)! + 1
          : (couponPos as any) ?? 7;
      out.push({
        id: "preview-main_coupon",
        code: "main_coupon",
        position: couponPos,
        is_active: mainCouponUi?.enabled ?? true ? 1 : 0,
        settings: mergeMainCouponFromUI({}, mainCouponUi || {}),
      });
    }

    if (!hasDelivery) {
      const pos =
        typeof (couponPos ?? offersPos ?? statsPos) === "number"
          ? (couponPos ?? offersPos ?? statsPos)! + 1
          : 8;
      out.push({
        id: "preview-store_delivery_info",
        code: "store_delivery_info",
        position: pos,
        is_active: storeDeliveryUi?.enabled ?? true ? 1 : 0,
        settings: mergeDeliveryInfoFromUI({}, storeDeliveryUi || {}),
      });
    }

    if (!hasAnn) {
      out.push({
        id: "preview-announcement",
        code: "announcement_bar",
        position: 1,
        settings: mergeAnnBarFromUI({}, headerSettings),
      });
    }

    return out.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));
  }, [
    runtimeLayout,
    headerSettings,
    topNavUi,
    storeHeroUi,
    flashSaleUi,
    storeStatsUi,
    storeDeliveryUi,
    mainCouponUi,
    offersUi,
  ]);

  return (
    <div
      className="rounded shadow bg-white text-sm"
      style={{ fontFamily: generalSettings.font }}
    >
      <RenderLayout layout={previewLayout} />

      {/* Demo product */}
      <div className="p-4 space-y-4">
        <div className="p-4 border rounded">
          <div className="text-md font-semibold mb-2">Product Name</div>
          <div className="text-gray-600 mb-2">₹999</div>
          <div className="flex gap-2 flex-wrap">
            {generalSettings.addToCart && (
              <button
                className="px-4 py-2 text-white"
                style={{
                  backgroundColor: generalSettings.themeColor,
                  borderRadius: generalSettings.borderRadius,
                }}
              >
                Add to Cart
              </button>
            )}
            {generalSettings.buyNow && (
              <button
                className="px-4 py-2 text-white"
                style={{
                  backgroundColor: generalSettings.themeColor,
                  borderRadius: generalSettings.borderRadius,
                }}
              >
                Buy Now
              </button>
            )}
            {generalSettings.showWhatsApp && (
              <button
                className="p-2 bg-green-500 text-white"
                style={{ borderRadius: generalSettings.borderRadius }}
              >
                WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePreview;
