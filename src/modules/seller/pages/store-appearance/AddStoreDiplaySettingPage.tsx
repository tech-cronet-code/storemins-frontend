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
  enabled: true, // is_active overrides this below
  bgUrl: s?.background_image_url || defaultStoreHeroUI.bgUrl,
  logoUrl: defaultStoreHeroUI.logoUrl, // local-only for now
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

interface AddStoreDiplaySettingPageProps {
  section?: string;
}

const AddStoreDiplaySettingPage: React.FC<
  AddStoreDiplaySettingPageProps
> = () => {
  const [selectedTab, setSelectedTab] = useState<
    "general" | "header" | "footer" | "home" | "about" | "terms"
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

  /* -------- header/announcement UI -------- */
  const [headerSettings, setHeaderSettings] = useState<any>({
    showAnnouncement: true,
    message: "this is announced bar test it out",
    barColor: "#296fc2",
    fontColor: "#FFFFFF",
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

  /* -------- menu/top_nav UI -------- */
  type MenuUI = ReturnType<typeof mapTopNavToUI> & { enabled?: boolean };
  const [menuSettings, setMenuSettings] = useState<MenuUI>({
    ...mapTopNavToUI({}),
    enabled: true,
  });

  /* -------- store hero UI -------- */
  const [storeHeroUi, setStoreHeroUi] =
    useState<StoreHeroUI>(defaultStoreHeroUI);

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
      let annBlockId =
        (annFromTheme?.id as string | undefined) ||
        (annFromRuntime?.id as string | undefined);
      const annPosition =
        (annFromTheme?.position as number | undefined) ??
        (annFromRuntime?.position as number | undefined) ??
        1;

      if (!annBlockId) {
        const created = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "announcement_bar",
            name: "Announcement Bar",
            is_active: headerSettings.showAnnouncement ? 1 : 0,
            position: Number(annPosition) || 1,
            settings: mergeAnnBarSettings({}, headerSettings),
          },
        }).unwrap();
        annBlockId = created.id;
      } else {
        await updateBlockMutation({
          id: annBlockId,
          body: {
            name: annFromTheme?.name || "Announcement Bar",
            custom_name: (annFromTheme as any)?.custom_name || "",
            position: Number(annPosition) || 1,
            is_active: headerSettings.showAnnouncement ? 1 : 0,
            settings: mergeAnnBarSettings(originalAnnSettings, headerSettings),
          },
        }).unwrap();
      }

      // B) Top Nav
      let navBlockId =
        (topNavFromTheme?.id as string | undefined) ||
        (topNavFromRuntime?.id as string | undefined);
      const navPosition =
        (topNavFromTheme?.position as number | undefined) ??
        (topNavFromRuntime?.position as number | undefined) ??
        2;

      const navSettingsPayload = mergeTopNavFromUI(
        originalTopNavSettings,
        menuSettings
      );

      if (!navBlockId) {
        const createdNav = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "top_nav",
            name: "Menu",
            is_active: menuSettings?.enabled ? 1 : 0,
            position: Number(navPosition) || 2,
            settings: navSettingsPayload,
          },
        }).unwrap();
        navBlockId = createdNav.id;
      } else {
        await updateBlockMutation({
          id: navBlockId,
          body: {
            name: topNavFromTheme?.name || "Menu",
            custom_name: (topNavFromTheme as any)?.custom_name || "",
            position: Number(navPosition) || 2,
            is_active: menuSettings?.enabled ? 1 : 0,
            settings: navSettingsPayload,
          },
        }).unwrap();
      }

      // C) Store Hero
      let heroBlockId =
        (heroFromTheme?.id as string | undefined) ||
        (heroFromRuntime?.id as string | undefined);
      const heroPosition =
        (heroFromTheme?.position as number | undefined) ??
        (heroFromRuntime?.position as number | undefined) ??
        (typeof navPosition === "number" ? navPosition + 1 : 3);

      const heroSettingsPayload = mergeStoreHeroFromUI(
        originalHeroSettings,
        storeHeroUi
      );

      if (!heroBlockId) {
        const createdHero = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "store_hero",
            name: "Store Hero",
            is_active: storeHeroUi.enabled ? 1 : 0,
            position: Number(heroPosition) || 3,
            settings: heroSettingsPayload,
          },
        }).unwrap();
        heroBlockId = createdHero.id;
      } else {
        await updateBlockMutation({
          id: heroBlockId,
          body: {
            name: heroFromTheme?.name || "Store Hero",
            custom_name: (heroFromTheme as any)?.custom_name || "",
            position: Number(heroPosition) || 3,
            is_active: storeHeroUi.enabled ? 1 : 0,
            settings: heroSettingsPayload,
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
            {/* Wrap the setter so we keep .enabled in our state */}
            <TopNavSettingsCard
              ui={menuSettings}
              onChange={(ui) => setMenuSettings((prev) => ({ ...prev, ...ui }))}
            />
            <StoreHeroSettingsCard ui={storeHeroUi} onChange={setStoreHeroUi} />
          </>
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
              { label: "Social Stats", key: "stats" }, // add here 
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
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddStoreDiplaySettingPage;