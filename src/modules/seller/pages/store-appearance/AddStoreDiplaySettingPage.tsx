/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../../dashboard/components/Layout";
import { UserRoleName } from "../../../auth/constants/userRoles";

import GeneralSettings from "../../components/store-appearance/GeneralSettings";
import HeaderSettings from "../../components/store-appearance/HeaderSettings";
import StorePreview from "../../components/store-appearance/StorePreview";
import TermsOfServiceSettings from "../../components/store-appearance/TermsOfServiceSettings";

import {
  useGetMyStoreDetailsQuery,
  useGetCurrentThemeQuery, // keep for save (themeId)
  useGetStorefrontDataQuery, // NEW: runtime preview/hydration
  useCreateBlockMutation,
  useUpdateBlockMutation,
  usePublishThemeMutation,
} from "../../../auth/services/storeApi";
import { useAuth } from "../../../auth/contexts/AuthContext";

/* ---------------- block settings shape (as saved to backend) ---------------- */
type AnnBarSettings = {
  enabled?: boolean;
  message?: string;
  section_background_color?: string;
  text_color?: string;

  visibility?: "all" | "desktop" | "mobile";
  marquee_enabled?: boolean;
  marquee_mode?: "bounce" | "loop";
  marquee_speed?: number;

  // left (support both naming styles for compat)
  left_button_enabled?: boolean;
  left_button_show?: boolean;
  left_button_text?: string;
  left_button_label?: string;
  left_button_url?: string;
  left_button_href?: string;
  left_button_new_tab?: boolean;

  // right (compat)
  right_button_enabled?: boolean;
  right_button_show?: boolean;
  right_button_text?: string;
  right_button_label?: string;
  right_button_url?: string;
  right_button_href?: string;
  right_button_new_tab?: boolean;

  [key: string]: any;
};

/* server -> UI */
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

  // local-only branding defaults
  showStoreLogo: true,
  storeLogo: "",
  showStoreName: true,
  storeName: "Nomi",
  contentAlignment: "center" as "left" | "center",
  favicon: "",
});

/* UI -> server (merge keeps unknown keys) */
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

/* =============================================================================== */

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

  /* -------- store id via useAuth -------- */
  const { userDetails } = useAuth();
  const businessIdFromAuth = userDetails?.storeLinks?.[0]?.businessId ?? null;

  // Fallback to API if auth didn't have it
  const { data: myStore, isFetching: loadingStore } = useGetMyStoreDetailsQuery(
    undefined,
    {
      skip: !!businessIdFromAuth,
    }
  );

  const businessStoreId =
    businessIdFromAuth ||
    (myStore as any)?.businessStoreId ||
    (myStore as any)?.id ||
    null;

  /* -------- general UI state (local only) -------- */
  const [generalSettings, setGeneralSettings] = useState({
    font: "Inter, ui-sans-serif, system-ui",
    themeColor: "#29A56C",
    borderRadius: "12px",
    addToCart: true,
    buyNow: false,
    showWhatsApp: true,
  });

  /* -------- header UI (announcement + branding + buttons) -------- */
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

  /* -------- policies (local UI only here) -------- */
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
  // A) Runtime storefront data for preview/hydration
  const { data: storefront, isFetching: loadingRuntime } =
    useGetStorefrontDataQuery(
      { businessStoreId: businessStoreId || "" },
      { skip: !businessStoreId }
    );

  // B) Current theme (only to know themeId for create/save)
  const { data: themeData, isFetching: loadingTheme } = useGetCurrentThemeQuery(
    { businessStoreId: businessStoreId || "" },
    { skip: !businessStoreId }
  );

  // Find announcement bar in runtime layout (snapshot or draft fallback)
  const annFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "announcement_bar");
  }, [storefront]);

  // Also find in draft theme (so we have blockId/position if needed)
  const annFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "announcement_bar");
  }, [themeData]);

  // Original settings to merge: prefer runtime (published) then draft
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

  // Hydrate UI when runtime/themed ann changes
  useEffect(() => {
    // if neither exists, keep defaults (user can create on Save)
    const mapped = mapToHeaderSettings(originalAnnSettings);
    setHeaderSettings((prev: any) => ({ ...prev, ...mapped }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annFromRuntime?.id, annFromTheme?.id]);

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
      // Prefer the draft block id if it exists; fall back to runtime id
      let blockId =
        (annFromTheme?.id as string | undefined) ||
        (annFromRuntime?.id as string | undefined);
      const blockPosition =
        (annFromTheme?.position as number | undefined) ??
        (annFromRuntime?.position as number | undefined) ??
        1;

      if (!blockId) {
        // Create if not present at all
        const created = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "announcement_bar",
            name: "Announcement Bar",
            is_active: headerSettings.showAnnouncement ? 1 : 0,
            settings: mergeAnnBarSettings({}, headerSettings),
          },
        }).unwrap();
        blockId = created.id;
      } else {
        // Update
        await updateBlockMutation({
          id: blockId,
          body: {
            name: annFromTheme?.name || "Announcement Bar",
            custom_name: (annFromTheme as any)?.custom_name || "",
            position: Number(blockPosition) || 1,
            is_active: headerSettings.showAnnouncement ? 1 : 0,
            settings: mergeAnnBarSettings(originalAnnSettings, headerSettings),
          },
        }).unwrap();
      }

      await publishTheme({ businessStoreId }).unwrap();
    } catch (e: any) {
      const data = e?.data || e?.response?.data;
      alert(data?.error || data?.message || e?.message || "Save failed");
    }
  };

  const handleCancel = () => window.location.reload();

  /* ------------------------------ Tabs (UI) ------------------------------ */
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
          <HeaderSettings
            headerSettings={headerSettings}
            onChange={setHeaderSettings}
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
              { label: "Footer", key: "footer" },
              { label: "Home Page", key: "home" },
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

            {/* Action Buttons */}
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
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddStoreDiplaySettingPage;
