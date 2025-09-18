/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { RenderLayout } from "../../../../shared/blocks/registry";
import { mergeAnnBarFromUI } from "../../../../shared/blocks/announcementBar";
import { mergeTopNavFromUI } from "../../../../shared/blocks/topNav";

interface StorePreviewProps {
  generalSettings: any;
  headerSettings: any; // announcement bar editor state
  runtimeLayout?: any[]; // storefront?.layout from API (likely frozen)
  topNavUi?: any; // top_nav editor state
  storeHeroUi?: {
    enabled?: boolean;
    bgUrl?: string;
    logoUrl?: string;
    title?: string;
    subtitle?: string;
    tagline?: string[];
    heightDesktop?: number;
    heightMobile?: number;
    borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
    overlayColor?: string;
    overlayOpacity?: number;
  };
}

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

const StorePreview: React.FC<StorePreviewProps> = ({
  generalSettings,
  headerSettings,
  runtimeLayout = [],
  topNavUi,
  storeHeroUi,
}) => {
  const previewLayout = useMemo(() => {
    const out: any[] = [];
    let hasAnn = false;
    let hasTopNav = false;
    let hasHero = false;
    let annPos: number | undefined;
    let navPos: number | undefined;

    for (const b of Array.isArray(runtimeLayout) ? runtimeLayout : []) {
      if (b?.code === "announcement_bar") {
        hasAnn = true;
        annPos = typeof b.position === "number" ? b.position : annPos;
        if (headerSettings?.showAnnouncement !== false) {
          out.push({
            ...b,
            settings: mergeAnnBarFromUI(b.settings, headerSettings),
          });
        }
      } else if (b?.code === "top_nav") {
        hasTopNav = true;
        navPos = typeof b.position === "number" ? b.position : navPos;
        if (topNavUi?.enabled !== false) {
          out.push({
            ...b,
            settings: mergeTopNavFromUI(b.settings, topNavUi || {}),
          });
        }
      } else if (b?.code === "store_hero") {
        hasHero = true;
        if (storeHeroUi?.enabled !== false) {
          out.push({
            ...b,
            settings: mergeStoreHeroFromUI(b.settings, storeHeroUi || {}),
          });
        }
      } else {
        out.push({ ...b });
      }
    }

    // Inject blocks that are missing (but only if enabled in UI)
    if (!hasTopNav && topNavUi?.enabled !== false) {
      navPos = typeof annPos === "number" ? annPos + 1 : 2;
      out.push({
        id: "preview-top_nav",
        code: "top_nav",
        position: navPos,
        settings: mergeTopNavFromUI({}, topNavUi || {}),
      });
    }

    if (!hasHero && storeHeroUi?.enabled !== false) {
      const pos = typeof navPos === "number" ? navPos + 1 : 3;
      out.push({
        id: "preview-store_hero",
        code: "store_hero",
        position: pos,
        settings: mergeStoreHeroFromUI({}, storeHeroUi || {}),
      });
    }

    if (!hasAnn && headerSettings?.showAnnouncement !== false) {
      out.push({
        id: "preview-announcement",
        code: "announcement_bar",
        position: 1,
        settings: mergeAnnBarFromUI({}, headerSettings),
      });
    }

    return out.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));
  }, [runtimeLayout, headerSettings, topNavUi, storeHeroUi]);

  return (
    <div
      className="rounded shadow bg-white text-sm"
      style={{ fontFamily: generalSettings.font }}
    >
      <RenderLayout layout={previewLayout} />

      {/* Optional product demo */}
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
