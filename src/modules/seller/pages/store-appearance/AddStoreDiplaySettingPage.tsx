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
  useGetCurrentThemeQuery,
  useGetStorefrontDataQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  usePublishThemeMutation,
} from "../../../auth/services/storeApi";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";

/* ---------- top_nav ---------- */
import {
  mapTopNavToUI,
  mergeTopNavFromUI,
} from "../../../../shared/blocks/topNav";
import { TopNavSettingsCard } from "./TopNavSettings";

/* ---------- store_hero ---------- */
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

/* ---------- Deals / Coupons Rail ---------- */
import MainCouponSettingsCard, {
  defaultMainCouponUI,
  MainCouponUI,
} from "./MainCouponSettings";

/* ---------- Offers / Collections ---------- */
import OffersCollectionsSettingsCard, {
  defaultOffersCollectionsUI,
  OffersCollectionsUI,
} from "./OffersCollectionsSettings";

/* ---------- Product Categories ---------- */
import ProductCategorySettingsCard, {
  defaultProductCategoryUI,
  ProductCategoryUI,
  mapProductCategoryToUI,
  mergeProductCategoryFromUI,
  ProductCategoryServerSettings,
} from "./ProductCategorySetting";

/* ---------- Scrollable Tabs ---------- */
import ScrollableTabs from "../../components/store-appearance/ScrollableTabs";

/* ---------- Customer Testimonials ---------- */
import {
  CustomerTestimonialsSettingsCard,
  defaultCustomerTestimonialsUI,
  CustomerTestimonialsUI,
} from "./CustomerTestimonialsSettings";

/* ---------- About Us (NEW) ---------- */
import {
  AboutUsUI,
  defaultAboutUsUI,
  mapAboutUsToUI,
  mergeAboutUsFromUI,
} from "../../../../shared/blocks/about_Us";
import AboutUsSettingsCard from "./AboutUsSettings";
import SocialProofStripSettingsCard from "./SocialProofStripSettings";

/* ---------- Footer / Bottom Nav (NEW) ---------- */
import BottomNavSettingsCard, {
  defaultFooterUI,
  FooterUI,
} from "./BottomNavSettings";

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

/* ---------------- Social Proof (inline card kept local) ---------------- */
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
    use_items_array: itemsArr.length > 0,
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
        out.item1 = { ...(existing?.item1 || {}), enabled: false };
        out.item2 = { ...(existing?.item2 || {}), enabled: false };
        out.item3 = { ...(existing?.item3 || {}), enabled: false };
        out.item4 = { ...(existing?.item4 || {}), enabled: false };
        out.item5 = { ...(existing?.item5 || {}), enabled: false };
      }
    } catch {
      /* ignore */
    }
  }

  return out;
};

/* ---------- Customer Testimonials mappers ---------- */
type CustomerTestimonialsServerSettings = {
  enabled?: boolean;
  section_background_color?: string;
  display_title?: boolean;
  title?: string;
  title_color?: string;
  display_subtitle?: boolean;
  subtitle?: string;
  subtitle_color?: string;
  testimonials?: any[];
  show_navigation?: boolean;
  auto_slide?: boolean;
  slide_interval?: number;
  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

const mapTestimonialsToUI = (
  s?: CustomerTestimonialsServerSettings
): CustomerTestimonialsUI => ({
  ...defaultCustomerTestimonialsUI,
  enabled: s?.enabled ?? defaultCustomerTestimonialsUI.enabled,
  section_background_color:
    s?.section_background_color ??
    defaultCustomerTestimonialsUI.section_background_color,
  display_title:
    s?.display_title ?? defaultCustomerTestimonialsUI.display_title,
  title: s?.title ?? defaultCustomerTestimonialsUI.title,
  title_color: s?.title_color ?? defaultCustomerTestimonialsUI.title_color,
  display_subtitle:
    s?.display_subtitle ?? defaultCustomerTestimonialsUI.display_subtitle,
  subtitle: s?.subtitle ?? defaultCustomerTestimonialsUI.subtitle,
  subtitle_color:
    s?.subtitle_color ?? defaultCustomerTestimonialsUI.subtitle_color,
  show_navigation:
    s?.show_navigation ?? defaultCustomerTestimonialsUI.show_navigation,
  auto_slide: s?.auto_slide ?? defaultCustomerTestimonialsUI.auto_slide,
  slide_interval:
    s?.slide_interval ?? defaultCustomerTestimonialsUI.slide_interval,
  testimonials_json:
    JSON.stringify(s?.testimonials || [], null, 2) ||
    defaultCustomerTestimonialsUI.testimonials_json,
});

const mergeTestimonialsFromUI = (
  existing: CustomerTestimonialsServerSettings | undefined,
  ui: CustomerTestimonialsUI
): CustomerTestimonialsServerSettings => {
  let parsed: any[] = [];
  try {
    const a = JSON.parse(ui.testimonials_json || "[]");
    parsed = Array.isArray(a) ? a : [];
  } catch {
    parsed = existing?.testimonials || [];
  }
  return {
    ...(existing || {}),
    enabled: !!ui.enabled,
    section_background_color: ui.section_background_color,
    display_title: !!ui.display_title,
    title: ui.title,
    title_color: ui.title_color,
    display_subtitle: !!ui.display_subtitle,
    subtitle: ui.subtitle,
    subtitle_color: ui.subtitle_color,
    show_navigation: !!ui.show_navigation,
    auto_slide: !!ui.auto_slide,
    slide_interval: Number(ui.slide_interval) || 5000,
    testimonials: parsed,
  };
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
    | "category"
    | "stats"
    | "testimonials"
    | "delivery"
    | "footer"
    | "about"
    | "terms"
  >("general");
  const formContainerRef = useRef<HTMLDivElement>(null!);

  const { userDetails } = useSellerAuth();
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

  /* -------- offers / collections UI -------- */
  const [offersUi, setOffersUi] = useState<OffersCollectionsUI>(
    defaultOffersCollectionsUI
  );

  /* -------- store stats UI -------- */
  const [storeStatsUi, setStoreStatsUi] =
    useState<StoreStatsUI>(defaultStoreStatsUI);

  /* -------- customer testimonials UI -------- */
  const [testimonialsUi, setTestimonialsUi] = useState<CustomerTestimonialsUI>(
    defaultCustomerTestimonialsUI
  );

  /* -------- social proof strip UI -------- */
  const [socialProofUi, setSocialProofUi] =
    useState<SocialProofUI>(defaultSocialProofUI);

  /* -------- deals / coupons rail UI -------- */
  const [mainCouponUi, setMainCouponUi] =
    useState<MainCouponUI>(defaultMainCouponUI);

  /* -------- product categories UI -------- */
  const [productCategoryUi, setProductCategoryUi] = useState<ProductCategoryUI>(
    defaultProductCategoryUI
  );

  /* -------- delivery info UI -------- */
  const [storeDeliveryUi, setStoreDeliveryUi] = useState<StoreDeliveryInfoUI>(
    defaultStoreDeliveryInfoUI
  );

  /* -------- About Us UI (NEW) -------- */
  const [aboutUsUi, setAboutUsUi] = useState<AboutUsUI>(defaultAboutUsUI);

  /* -------- Footer / Bottom Nav UI (NEW) -------- */
  const [footerUi, setFooterUi] = useState<FooterUI>(defaultFooterUI);

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
  const {
    data: storefront,
    isFetching: loadingRuntime,
    refetch: refetchStorefront,
  } = useGetStorefrontDataQuery(
    { businessStoreId: businessStoreId || "" },
    { skip: !businessStoreId }
  );

  const {
    data: themeData,
    isFetching: loadingTheme,
    refetch: refetchTheme,
  } = useGetCurrentThemeQuery(
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

  // offers_collections
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

  // customer_testimonials
  const testiFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "customer_testimonials");
  }, [storefront]);

  const testiFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "customer_testimonials");
  }, [themeData]);

  const originalTestimonialsSettings =
    useMemo<CustomerTestimonialsServerSettings>(() => {
      try {
        if (testiFromRuntime?.settings)
          return testiFromRuntime.settings as CustomerTestimonialsServerSettings;
        if (!testiFromTheme) return {};
        return typeof testiFromTheme.settings === "string"
          ? JSON.parse(testiFromTheme.settings || "{}")
          : (testiFromTheme.settings as any) || {};
      } catch {
        return {};
      }
    }, [testiFromRuntime?.settings, testiFromTheme]);

  useEffect(() => {
    const activeFlag =
      (typeof testiFromRuntime?.is_active === "number"
        ? testiFromRuntime.is_active
        : testiFromTheme?.is_active) ?? 1;

    setTestimonialsUi({
      ...mapTestimonialsToUI(originalTestimonialsSettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testiFromRuntime?.id, testiFromTheme?.id]);

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

  // product_category
  const categoryFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "product_category");
  }, [storefront]);
  const categoryFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "product_category");
  }, [themeData]);
  const originalCategorySettings =
    useMemo<ProductCategoryServerSettings>(() => {
      try {
        if (categoryFromRuntime?.settings)
          return categoryFromRuntime.settings as ProductCategoryServerSettings;
        if (!categoryFromTheme) return {};
        return typeof categoryFromTheme.settings === "string"
          ? JSON.parse(categoryFromTheme.settings || "{}")
          : (categoryFromTheme.settings as any) || {};
      } catch {
        return {};
      }
    }, [categoryFromRuntime?.settings, categoryFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof categoryFromRuntime?.is_active === "number"
        ? categoryFromRuntime.is_active
        : categoryFromTheme?.is_active) ?? 1;

    setProductCategoryUi({
      ...mapProductCategoryToUI(originalCategorySettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromRuntime?.id, categoryFromTheme?.id]);

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

  // about_us (NEW)
  const aboutFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "about_us");
  }, [storefront]);
  const aboutFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "about_us");
  }, [themeData]);
  const originalAboutSettings = useMemo<any>(() => {
    try {
      if (aboutFromRuntime?.settings) return aboutFromRuntime.settings;
      if (!aboutFromTheme) return {};
      return typeof aboutFromTheme.settings === "string"
        ? JSON.parse(aboutFromTheme.settings || "{}")
        : (aboutFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [aboutFromRuntime?.settings, aboutFromTheme]);
  useEffect(() => {
    const activeFlag =
      (typeof aboutFromRuntime?.is_active === "number"
        ? aboutFromRuntime.is_active
        : aboutFromTheme?.is_active) ?? 1;
    setAboutUsUi({
      ...mapAboutUsToUI(originalAboutSettings),
      enabled: activeFlag !== 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutFromRuntime?.id, aboutFromTheme?.id]);

  // bottom_nav (FOOTER)
  const footerFromRuntime = useMemo(() => {
    const layout = storefront?.layout || [];
    return layout.find((i: any) => i?.code === "bottom_nav");
  }, [storefront]);

  const footerFromTheme = useMemo(() => {
    const blocks = themeData?.design_elements || [];
    return blocks.find((b) => b.code === "bottom_nav");
  }, [themeData]);

  const originalFooterSettings = useMemo<any>(() => {
    try {
      if (footerFromRuntime?.settings) return footerFromRuntime.settings;
      if (!footerFromTheme) return {};
      return typeof footerFromTheme.settings === "string"
        ? JSON.parse(footerFromTheme.settings || "{}")
        : (footerFromTheme.settings as any) || {};
    } catch {
      return {};
    }
  }, [footerFromRuntime?.settings, footerFromTheme]);

  useEffect(() => {
    const activeFlag =
      (typeof footerFromRuntime?.is_active === "number"
        ? footerFromRuntime.is_active
        : footerFromTheme?.is_active) ?? 1;

    setFooterUi({
      ...defaultFooterUI,
      ...(originalFooterSettings || {}),
      visibility:
        (originalFooterSettings?.visibility as FooterUI["visibility"]) ??
        defaultFooterUI.visibility,
      show_desktop_footer:
        originalFooterSettings?.show_desktop_footer ??
        defaultFooterUI.show_desktop_footer,
      show_desktop_footer_in_mobile_too:
        originalFooterSettings?.show_desktop_footer_in_mobile_too ??
        defaultFooterUI.show_desktop_footer_in_mobile_too,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [footerFromRuntime?.id, footerFromTheme?.id]);

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

      // D) Flash Sale Hero
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

      // E) Offers / Collections
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

      // F) Store Stats
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

      // F2) Customer Testimonials
      let testiId =
        (testiFromTheme?.id as string | undefined) ||
        (testiFromRuntime?.id as string | undefined);
      const testiPos =
        (testiFromTheme?.position as number | undefined) ??
        (testiFromRuntime?.position as number | undefined) ??
        (typeof statsPos === "number" ? statsPos + 1 : 7);

      const testiSettingsPayload = mergeTestimonialsFromUI(
        originalTestimonialsSettings,
        testimonialsUi
      );

      if (!testiId) {
        const createdTesti = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "customer_testimonials",
            name: "Customer Testimonials",
            is_active: testimonialsUi.enabled ? 1 : 0,
            position: Number(testiPos) || 7,
            settings: testiSettingsPayload,
          },
        }).unwrap();
        testiId = createdTesti.id;
      } else {
        await updateBlockMutation({
          id: testiId,
          body: {
            name: testiFromTheme?.name || "Customer Testimonials",
            custom_name: (testiFromTheme as any)?.custom_name || "",
            position: Number(testiPos) || 7,
            is_active: testimonialsUi.enabled ? 1 : 0,
            settings: testiSettingsPayload,
          },
        }).unwrap();
      }

      // G) Social Proof Strip
      let spsId =
        (spsFromTheme?.id as string | undefined) ||
        (spsFromRuntime?.id as string | undefined);
      const spsPos =
        (spsFromTheme?.position as number | undefined) ??
        (spsFromRuntime?.position as number | undefined) ??
        (typeof testiPos === "number" ? testiPos + 1 : 8);

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
            position: Number(spsPos) || 8,
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
            position: Number(spsPos) || 8,
            is_active: socialProofUi.enabled ? 1 : 0,
            settings: spsSettingsPayload,
          },
        }).unwrap();
      }

      // H) Deals / Coupons Rail
      let couponId =
        (couponFromTheme?.id as string | undefined) ||
        (couponFromRuntime?.id as string | undefined);
      const couponPos =
        (couponFromTheme?.position as number | undefined) ??
        (couponFromRuntime?.position as number | undefined) ??
        (typeof spsPos === "number"
          ? spsPos + 1
          : typeof testiPos === "number"
          ? testiPos + 1
          : 9);

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
            position: Number(couponPos) || 9,
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
            position: Number(couponPos) || 9,
            is_active: mainCouponUi.enabled ? 1 : 0,
            settings: couponSettingsPayload,
          },
        }).unwrap();
      }

      // H2) Product Categories
      let categoryId =
        (categoryFromTheme?.id as string | undefined) ||
        (categoryFromRuntime?.id as string | undefined);
      const categoryPos =
        (categoryFromTheme?.position as number | undefined) ??
        (categoryFromRuntime?.position as number | undefined) ??
        (typeof couponPos === "number" ? couponPos + 1 : 10);

      const categorySettingsPayload = mergeProductCategoryFromUI(
        originalCategorySettings,
        productCategoryUi
      );

      if (!categoryId) {
        const createdCategory = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "product_category",
            name: "Product Categories",
            is_active: productCategoryUi.enabled ? 1 : 0,
            position: Number(categoryPos) || 10,
            settings: categorySettingsPayload,
          },
        }).unwrap();
        categoryId = createdCategory.id;
      } else {
        await updateBlockMutation({
          id: categoryId,
          body: {
            name: categoryFromTheme?.name || "Product Categories",
            custom_name: (categoryFromTheme as any)?.custom_name || "",
            position: Number(categoryPos) || 10,
            is_active: productCategoryUi.enabled ? 1 : 0,
            settings: categorySettingsPayload,
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
        (typeof categoryPos === "number"
          ? categoryPos + 1
          : typeof couponPos === "number"
          ? couponPos + 1
          : 11);

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
            position: Number(deliveryPos) || 11,
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
            position: Number(deliveryPos) || 11,
            is_active: storeDeliveryUi.enabled ? 1 : 0,
            settings: deliverySettingsPayload,
          },
        }).unwrap();
      }

      // J) About Us (NEW — after Delivery Info)
      let aboutId =
        (aboutFromTheme?.id as string | undefined) ||
        (aboutFromRuntime?.id as string | undefined);
      const aboutPos =
        (aboutFromTheme?.position as number | undefined) ??
        (aboutFromRuntime?.position as number | undefined) ??
        (typeof deliveryPos === "number" ? deliveryPos + 1 : 12);

      const aboutSettingsPayload = mergeAboutUsFromUI(
        originalAboutSettings,
        aboutUsUi
      );

      if (!aboutId) {
        const createdAbout = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "about_us",
            name: "About Us",
            is_active: aboutUsUi.enabled ? 1 : 0,
            position: Number(aboutPos) || 12,
            settings: aboutSettingsPayload,
          },
        }).unwrap();
        aboutId = createdAbout.id;
      } else {
        await updateBlockMutation({
          id: aboutId,
          body: {
            name: aboutFromTheme?.name || "About Us",
            custom_name: (aboutFromTheme as any)?.custom_name || "",
            position: Number(aboutPos) || 12,
            is_active: aboutUsUi.enabled ? 1 : 0,
            settings: aboutSettingsPayload,
          },
        }).unwrap();
      }

      // K) FOOTER (bottom_nav)
      let footerId =
        (footerFromTheme?.id as string | undefined) ||
        (footerFromRuntime?.id as string | undefined);

      const footerPos =
        (footerFromTheme?.position as number | undefined) ??
        (footerFromRuntime?.position as number | undefined) ??
        (typeof aboutPos === "number" ? aboutPos + 1 : 13);

      const footerSettingsPayload = {
        ...originalFooterSettings,
        ...footerUi,
      };

      if (!footerId) {
        const createdFooter = await createBlock({
          businessStoreId,
          themeId,
          body: {
            code: "bottom_nav",
            name: "Footer",
            is_active: 1,
            position: Number(footerPos) || 13,
            settings: footerSettingsPayload,
          },
        }).unwrap();
        footerId = createdFooter.id;
      } else {
        await updateBlockMutation({
          id: footerId,
          body: {
            name: footerFromTheme?.name || "Footer",
            custom_name: (footerFromTheme as any)?.custom_name || "",
            position: Number(footerPos) || 13,
            is_active: 1,
            settings: footerSettingsPayload,
          },
        }).unwrap();
      }

      // Publish & refresh local caches so UI reflects saved API state
      await publishTheme({ businessStoreId }).unwrap();
      await Promise.allSettled([refetchTheme(), refetchStorefront()]);

      alert("Saved!");
    } catch (e: any) {
      const data = e?.data || e?.response?.data;
      alert(data?.error || data?.message || e?.message || "Save failed");
    }
  };

  const handleCancel = () => window.location.reload();

  /* ------------------------------ Tabs list ------------------------------ */
  const TABS: { label: string; key: typeof selectedTab }[] = [
    { label: "General", key: "general" },
    { label: "Header", key: "header" },
    { label: "Flash Sale", key: "flash" },
    { label: "Offers", key: "offers" },
    { label: "Deals", key: "deals" },
    { label: "Product/Categories", key: "category" },
    { label: "Social Stats", key: "stats" },
    { label: "Testimonials", key: "testimonials" },
    { label: "Delivery Info", key: "delivery" },
    { label: "About Us", key: "about" },
    { label: "Footer", key: "footer" },
    { label: "Terms Of Service", key: "terms" },
  ];

  /* ------------------------------ Tab content ------------------------------ */
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
      case "category":
        return (
          <ProductCategorySettingsCard
            ui={productCategoryUi}
            onChange={setProductCategoryUi}
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
      case "testimonials":
        return (
          <CustomerTestimonialsSettingsCard
            ui={testimonialsUi}
            onChange={setTestimonialsUi}
          />
        );
      case "delivery":
        return (
          <StoreDeliveryInfoSettingsCard
            ui={storeDeliveryUi}
            onChange={setStoreDeliveryUi}
          />
        );
      case "about":
        return <AboutUsSettingsCard ui={aboutUsUi} onChange={setAboutUsUi} />;
      case "footer":
        return <BottomNavSettingsCard ui={footerUi} onChange={setFooterUi} />;
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
        <div className="w-full md:w-[50%] flex flex-col bg-white border-r border-gray-200 overflow-hidden">
          {/* Sticky, single-line, scrollable tabs */}
          <div className="sticky top-0 z-20 bg-white pt-6 pb-2 border-b border-gray-200">
            <ScrollableTabs
              tabs={TABS}
              value={selectedTab}
              onChange={(k) => setSelectedTab(k)}
            />
          </div>

          {/* Scrollable Form Section */}
          <div
            ref={formContainerRef}
            className="flex-1 overflow-y-auto px-6 space-y-6 pb-16"
          >
            {renderTab()}

            {/* Actions */}
            <div className="bg-white pt-4 pb-6 flex justify-end gap-4 border-t border-gray-200">
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
            mainCouponUi={mainCouponUi}
            offersUi={offersUi}
            testimonialsUi={testimonialsUi}
            aboutUsUi={aboutUsUi as any}
            footerUi={footerUi as any}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddStoreDiplaySettingPage;
