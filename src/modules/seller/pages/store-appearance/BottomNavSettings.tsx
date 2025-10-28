/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";

/* =========================================================================
   Types & Defaults
   ========================================================================= */

export type FooterUI = {
  // Mobile (sticky) nav
  footer_type: "blur_float" | "blur_bottom" | "solid";
  footer_background_color: string;
  footer_text_color: string;
  footer_text_active_color: string;
  show_discount_banner: boolean;
  selected_discount_id: string | null;

  // Icons (string ids – we render inline svgs in BottomNav.tsx)
  home_icon: string;
  search_icon: string;
  cart_icon: string;
  account_icon: string;

  // Desktop footer panel
  show_desktop_footer: boolean;
  show_desktop_footer_in_mobile_too: boolean;
  desktop_footer_background_color: string;
  desktop_footer_title_color: string;
  desktop_footer_text_color: string;
  desktop_footer_link_color: string;
  desktop_footer_about_us_title: string;
  desktop_footer_about_us_content: string;
  desktop_footer_links_title: string;
  desktop_footer_links: Array<{ label: string; href: string }>;

  // misc
  custom_css: string | null;
  visibility: "all" | "desktop" | "mobile";
};

export const defaultFooterUI: FooterUI = {
  footer_type: "blur_float",
  footer_background_color: "#ffffff",
  footer_text_color: "#4b5563",
  footer_text_active_color: "#030712",
  show_discount_banner: false,
  selected_discount_id: null,

  home_icon: "home",
  search_icon: "search",
  cart_icon: "cart",
  account_icon: "account",

  show_desktop_footer: true,
  show_desktop_footer_in_mobile_too: false,
  desktop_footer_background_color: "#f3f4f6",
  desktop_footer_title_color: "#111827",
  desktop_footer_text_color: "#6b7280",
  desktop_footer_link_color: "#111827",
  desktop_footer_about_us_title: "About Us",
  desktop_footer_about_us_content:
    "Welcome to our store! We're here to bring you quality products and services with convenience, care, and trust.",
  desktop_footer_links_title: "Links",
  desktop_footer_links: [],

  custom_css: null,
  visibility: "all",
};

/* =========================================================================
   Small building blocks
   ========================================================================= */

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {children}
  </div>
);

const CardHeader = ({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) => (
  <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
    <div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description ? (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      ) : null}
    </div>
    {right}
  </div>
);

const Section = ({
  title,
  description,
  children,
  dense,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  dense?: boolean;
}) => (
  <section className={dense ? "space-y-3" : "space-y-4"}>
    <header>
      <div className="flex items-center gap-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      {description ? (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      ) : null}
    </header>
    {children}
  </section>
);

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {hint ? <span className="block text-xs text-gray-500">{hint}</span> : null}
    <div className="mt-1">{children}</div>
  </label>
);

const Input = (
  props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
) => (
  <input
    {...props}
    className={[
      "w-full rounded-md border bg-white px-3 py-2 text-sm",
      "placeholder:text-gray-400",
      props.className || "",
      props.invalid
        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-gray-400 focus:ring-gray-300",
      "outline-none transition-shadow focus:ring-2",
    ].join(" ")}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={[
      "w-full rounded-md border bg-white px-3 py-2 text-sm",
      "placeholder:text-gray-400",
      "border-gray-300 focus:border-gray-400 focus:ring-gray-300",
      "outline-none transition-shadow focus:ring-2",
      props.className || "",
    ].join(" ")}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={[
      "w-full rounded-md border bg-white px-3 py-2 text-sm",
      "border-gray-300 focus:border-gray-400 focus:ring-gray-300",
      "outline-none transition-shadow focus:ring-2",
      props.className || "",
    ].join(" ")}
  />
);

const Toggle = ({
  checked,
  onChange,
  label,
  hint,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  hint?: string;
  id?: string;
}) => (
  <div className="flex items-start gap-3">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        checked
          ? "bg-blue-600 focus:ring-blue-500"
          : "bg-gray-300 focus:ring-gray-400",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </div>
  </div>
);

/** Color field with hex text input kept in sync */
const ColorInput = ({
  value,
  onChange,
  label,
  hint,
}: {
  value: string;
  onChange: (hex: string) => void;
  label: string;
  hint?: string;
}) => {
  const setHex = useCallback(
    (hex: string) => {
      // Normalize to #RRGGBB if possible
      let v = hex.trim();
      if (!v.startsWith("#")) v = `#${v}`;
      if (/^#([0-9a-f]{3})$/i.test(v)) {
        // expand #abc -> #aabbcc
        v = v.replace(
          /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i,
          (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
        );
      }
      if (/^#([0-9a-f]{6})$/i.test(v)) {
        onChange(v.toUpperCase());
      } else {
        onChange(hex); // fallback to raw string so user can finish typing
      }
    },
    [onChange]
  );

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-md border border-gray-200"
          aria-label={`${label} color`}
          title={value}
        />
        <Input
          value={value}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#000000"
          aria-label={`${label} hex value`}
        />
      </div>
    </Field>
  );
};

/** Icon quick-pick (no external libs, just simple options + preview dot) */
const ICON_OPTIONS = [
  "home",
  "search",
  "cart",
  "account",
  "heart",
  "grid",
  "tag",
] as const;
type IconOption = (typeof ICON_OPTIONS)[number];

const IconPicker = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: IconOption | string) => void;
  label: string;
}) => {
  return (
    <Field
      label={label}
      hint="Common values: home, search, cart, account, heart, grid, tag"
    >
      <div className="flex items-center gap-2">
        <Select
          value={ICON_OPTIONS.includes(value as IconOption) ? value : ""}
          onChange={(e) => onChange((e.target.value as IconOption) || value)}
          aria-label={`${label} (quick pick)`}
          className="w-40"
        >
          <option value="">– Quick pick –</option>
          {ICON_OPTIONS.map((opt) => (
            <option value={opt} key={opt}>
              {opt}
            </option>
          ))}
        </Select>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="custom-icon-id"
          aria-label={`${label} (custom id)`}
        />
      </div>
    </Field>
  );
};

/* =========================================================================
   Main Component
   ========================================================================= */

export default function BottomNavSettingsCard({
  ui,
  onChange,
}: {
  ui: FooterUI;
  onChange: (next: FooterUI) => void;
}) {
  const set = <K extends keyof FooterUI>(k: K, v: FooterUI[K]) =>
    onChange({ ...ui, [k]: v });

  const updateLink = (
    i: number,
    patch: Partial<FooterUI["desktop_footer_links"][number]>
  ) => {
    const arr = [...ui.desktop_footer_links];
    arr[i] = { ...arr[i], ...patch };
    set("desktop_footer_links", arr);
  };

  const moveLink = (i: number, dir: -1 | 1) => {
    const arr = [...ui.desktop_footer_links];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    set("desktop_footer_links", arr);
  };

  const removeLink = (i: number) =>
    set(
      "desktop_footer_links",
      ui.desktop_footer_links.filter((_, idx) => idx !== i)
    );

  return (
    <Card>
      <CardHeader
        title="Footer / Bottom Navigation"
        description="Configure the mobile sticky bar and the desktop footer. Designed for clarity, speed, and consistency."
        right={
          <div className="flex items-center gap-2">
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                ui.visibility === "all"
                  ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                  : ui.visibility === "desktop"
                  ? "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
              ].join(" ")}
              title="Current visibility"
            >
              {ui.visibility === "all"
                ? "Visible: All devices"
                : ui.visibility === "desktop"
                ? "Visible: Desktop only"
                : "Visible: Mobile only"}
            </span>
          </div>
        }
      />

      <div className="px-6 py-6 space-y-10">
        {/* Visibility */}
        <Section
          title="Visibility"
          description="Control where this block shows up."
          dense
        >
          <div className="max-w-sm">
            <Select
              value={ui.visibility}
              onChange={(e) =>
                set("visibility", e.target.value as FooterUI["visibility"])
              }
            >
              <option value="all">Show on all devices</option>
              <option value="desktop">Desktop only</option>
              <option value="mobile">Mobile only</option>
            </Select>
          </div>
        </Section>

        {/* Mobile Bottom Bar */}
        <Section
          title="Mobile Bottom Bar"
          description="A sticky, high-visibility navigation for small screens."
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Field label="Style" hint="Choose how the bar sits over content">
              <Select
                value={ui.footer_type}
                onChange={(e) =>
                  set("footer_type", e.target.value as FooterUI["footer_type"])
                }
              >
                <option value="blur_float">Blur Float</option>
                <option value="blur_bottom">Blur Bottom</option>
                <option value="solid">Solid</option>
              </Select>
            </Field>

            <ColorInput
              label="Background"
              hint="Bar background color"
              value={ui.footer_background_color}
              onChange={(v) => set("footer_background_color", v)}
            />

            <ColorInput
              label="Icon/Label"
              hint="Default icon & label color"
              value={ui.footer_text_color}
              onChange={(v) => set("footer_text_color", v)}
            />

            <ColorInput
              label="Active Color"
              hint="Selected item color"
              value={ui.footer_text_active_color}
              onChange={(v) => set("footer_text_active_color", v)}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <IconPicker
              value={ui.home_icon}
              onChange={(v) => set("home_icon", v)}
              label="Home icon"
            />
            <IconPicker
              value={ui.search_icon}
              onChange={(v) => set("search_icon", v)}
              label="Search icon"
            />
            <IconPicker
              value={ui.cart_icon}
              onChange={(v) => set("cart_icon", v)}
              label="Cart icon"
            />
            <IconPicker
              value={ui.account_icon}
              onChange={(v) => set("account_icon", v)}
              label="Account icon"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Toggle
              checked={ui.show_discount_banner}
              onChange={(v) => set("show_discount_banner", v)}
              label="Show discount banner"
              hint="Displays a slim banner above the bottom bar when a discount is active."
            />
            {ui.show_discount_banner ? (
              <Field
                label="Selected discount ID"
                hint="Enter a discount/campaign ID to bind the banner"
              >
                <Input
                  value={ui.selected_discount_id ?? ""}
                  onChange={(e) =>
                    set(
                      "selected_discount_id",
                      e.target.value.trim() ? e.target.value : null
                    )
                  }
                  placeholder="e.g. WkndFLASH2025"
                />
              </Field>
            ) : null}
          </div>
        </Section>

        {/* Desktop Footer Panel */}
        <Section
          title="Desktop Footer Panel"
          description="Informative footer with About & Links, tuned for large screens."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Toggle
              checked={ui.show_desktop_footer}
              onChange={(v) => set("show_desktop_footer", v)}
              label="Show desktop footer"
              hint="Enable the footer section on desktop layouts."
            />
            {ui.show_desktop_footer ? (
              <Toggle
                checked={ui.show_desktop_footer_in_mobile_too}
                onChange={(v) => set("show_desktop_footer_in_mobile_too", v)}
                label="Show desktop footer in mobile"
                hint="Display the same footer content on mobile below the sticky bar."
              />
            ) : null}
          </div>

          {ui.show_desktop_footer && (
            <div className="mt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ColorInput
                  label="Background"
                  value={ui.desktop_footer_background_color}
                  onChange={(v) => set("desktop_footer_background_color", v)}
                />
                <ColorInput
                  label="Title color"
                  value={ui.desktop_footer_title_color}
                  onChange={(v) => set("desktop_footer_title_color", v)}
                />
                <ColorInput
                  label="Text color"
                  value={ui.desktop_footer_text_color}
                  onChange={(v) => set("desktop_footer_text_color", v)}
                />
                <ColorInput
                  label="Link color"
                  value={ui.desktop_footer_link_color}
                  onChange={(v) => set("desktop_footer_link_color", v)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="About title">
                  <Input
                    value={ui.desktop_footer_about_us_title}
                    onChange={(e) =>
                      set("desktop_footer_about_us_title", e.target.value)
                    }
                  />
                </Field>
                <Field label="Links title">
                  <Input
                    value={ui.desktop_footer_links_title}
                    onChange={(e) =>
                      set("desktop_footer_links_title", e.target.value)
                    }
                  />
                </Field>
              </div>

              <Field
                label="About content"
                hint="A short brand story or promise"
              >
                <Textarea
                  rows={4}
                  value={ui.desktop_footer_about_us_content}
                  onChange={(e) =>
                    set("desktop_footer_about_us_content", e.target.value)
                  }
                />
              </Field>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">Links</h5>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                      onClick={() =>
                        set("desktop_footer_links", [
                          ...ui.desktop_footer_links,
                          { label: "New link", href: "#" },
                        ])
                      }
                    >
                      + Add link
                    </button>
                    {ui.desktop_footer_links.length > 0 && (
                      <button
                        type="button"
                        className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                        onClick={() => set("desktop_footer_links", [])}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                  {ui.desktop_footer_links.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      No links yet. Click “Add link” to create one.
                    </div>
                  ) : (
                    ui.desktop_footer_links.map((lnk, i) => (
                      <div
                        key={`${lnk.label}-${i}`}
                        className="p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                      >
                        <Input
                          className="md:col-span-4"
                          placeholder="Label"
                          value={lnk.label}
                          onChange={(e) =>
                            updateLink(i, { label: e.target.value })
                          }
                        />
                        <Input
                          className="md:col-span-6"
                          placeholder="https://example.com"
                          value={lnk.href}
                          onChange={(e) =>
                            updateLink(i, { href: e.target.value })
                          }
                        />
                        <div className="md:col-span-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                            onClick={() => moveLink(i, -1)}
                            disabled={i === 0}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                            onClick={() => moveLink(i, 1)}
                            disabled={i === ui.desktop_footer_links.length - 1}
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => removeLink(i)}
                            title="Remove"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Custom CSS */}
        <Section
          title="Custom CSS"
          description="Advanced: add optional CSS to fine-tune visuals. Avoid heavy overrides for performance."
        >
          <Textarea
            rows={5}
            placeholder="/* optional */"
            value={ui.custom_css || ""}
            onChange={(e) => set("custom_css", e.target.value || null)}
          />
        </Section>
      </div>
    </Card>
  );
}
