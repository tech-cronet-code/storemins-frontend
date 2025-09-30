/* eslint-disable @typescript-eslint/no-explicit-any */

export type AboutUsBullet =
  | string
  | {
      /** Remix icon class, e.g. "ri-truck-line" */
      icon?: string;
      /** Line of text */
      text: string;
    };

export type AboutUsItem = {
  key: string;
  /** Remix icon for the card header (e.g. "ri-truck-line") */
  icon?: string;
  title: string;
  bullets: AboutUsBullet[];
};

export type AboutUsServerSettings = {
  enabled?: boolean;

  // header
  display_title?: boolean;
  title?: string;
  title_color?: string;
  display_subtitle?: boolean;
  subtitle?: string;
  subtitle_color?: string;
  align?: "left" | "center" | "right";

  // layout
  section_background_color?: string;
  grid_desktop_columns?: 1 | 2 | 3 | 4;
  grid_tablet_columns?: 1 | 2 | 3;
  card_radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  card_shadow?: "none" | "sm" | "md" | "lg";
  card_divider?: boolean;
  use_accordion?: boolean;

  // cards
  items?: AboutUsItem[];

  section_top_margin?: string;
  section_bottom_margin?: string;
  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

/* ---------- UI model used by SettingsCard ---------- */
export type AboutUsUI = Required<AboutUsServerSettings>;

export const defaultAboutUsUI: AboutUsUI = {
  enabled: true,

  // header
  display_title: true,
  title: "About us",
  title_color: "#111827",
  display_subtitle: false,
  subtitle: "",
  subtitle_color: "#6b7280",
  align: "left",

  // layout
  section_background_color: "#ffffff",
  grid_desktop_columns: 4,
  grid_tablet_columns: 2,
  card_radius: "xl",
  card_shadow: "md",
  card_divider: true,
  use_accordion: true,

  // cards (with per-bullet icons to match the screenshots)
  items: [
    {
      key: "orders",
      icon: "ri-truck-line",
      title: "Orders and delivery",
      bullets: [
        { icon: "ri-truck-line", text: "Delivery across India" },
        { icon: "ri-star-line", text: "Delivery fee will apply" },
        {
          icon: "ri-truck-line",
          text: "All orders will be delivered by SampleStore.co",
        },
        {
          icon: "ri-focus-2-line",
          text: "Enter pincode details in home page for estimated delivery timeline",
        },
      ],
    },
    {
      key: "cancellation",
      icon: "ri-close-circle-line",
      title: "Cancellation policy",
      bullets: [
        {
          icon: "ri-checkbox-circle-line",
          text: "Full refund if you cancel it before the order is accepted by us. For any queries on cancellations reach out to us via chat",
        },
      ],
    },
    {
      key: "returns",
      icon: "ri-refresh-line",
      title: "Return policy",
      bullets: [
        {
          icon: "ri-file-text-line",
          text: "For Terms & Conditions Refer to our highlights",
        },
      ],
    },
    {
      key: "contact",
      icon: "ri-customer-service-2-line",
      title: "How to reach us",
      bullets: [
        { icon: "ri-map-pin-2-line", text: "Jogeshwari West, Mumbai" },
        { icon: "ri-mail-line", text: "XXXXXXXXXXXXXX014@gmail.com" },
      ],
    },
  ],

  section_top_margin: "0rem",
  section_bottom_margin: "1.5rem",
  custom_css: null,
  visibility: "all",
};

/* ---------- mappers ---------- */
export const mapAboutUsToUI = (s?: AboutUsServerSettings): AboutUsUI => ({
  ...defaultAboutUsUI,
  ...(s || {}),
  grid_desktop_columns:
    (s?.grid_desktop_columns as any) ?? defaultAboutUsUI.grid_desktop_columns,
  grid_tablet_columns:
    (s?.grid_tablet_columns as any) ?? defaultAboutUsUI.grid_tablet_columns,
  card_radius: (s?.card_radius as any) ?? defaultAboutUsUI.card_radius,
  card_shadow: (s?.card_shadow as any) ?? defaultAboutUsUI.card_shadow,
  align: (s?.align as any) ?? defaultAboutUsUI.align,
  visibility: (s?.visibility as any) ?? defaultAboutUsUI.visibility,
});

export const mergeAboutUsFromUI = (
  existing: AboutUsServerSettings | undefined,
  ui: Partial<AboutUsUI>
): AboutUsServerSettings => ({
  ...(existing || {}),
  ...(ui || {}),
  grid_desktop_columns: ui.grid_desktop_columns as any,
  grid_tablet_columns: ui.grid_tablet_columns as any,
  card_radius: ui.card_radius as any,
  card_shadow: ui.card_shadow as any,
  align: ui.align as any,
  visibility: ui.visibility as any,
});
