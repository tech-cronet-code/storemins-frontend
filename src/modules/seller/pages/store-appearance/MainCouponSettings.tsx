import React, { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types & defaults                                                    */
/* ------------------------------------------------------------------ */

export type CouponItem = {
  enabled?: boolean;
  badge_text?: string;
  badge_bg?: string;
  badge_color?: string;
  title?: string;
  subtitle?: string;
  href?: string;
};

export type MainCouponUI = {
  enabled?: boolean;

  // header
  display_title?: boolean;
  title?: string;
  title_color?: string;
  align?: "left" | "center" | "right";

  // items
  items?: CouponItem[];

  // card UI
  card_radius?: number;
  card_border?: boolean;
  card_border_color?: string;
  card_text_color?: string;
  card_subtle_text_color?: string;
  card_bg?: string;
  card_shadow?: boolean;
  card_height_px?: number;
  card_horizontal_pad_px?: number;
  gap_px?: number;

  // arrows
  show_arrows_desktop?: boolean;
  show_arrows_mobile?: boolean;
  arrows_bg?: string;
  arrows_fg?: string;

  // rail centering
  center_rail_ends?: boolean;

  // section
  section_background_color?: string;
  section_top_margin?: string;
  section_bottom_margin?: string;

  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

export const defaultMainCouponUI: MainCouponUI = {
  enabled: true,
  display_title: true,
  title: "Deals for you",
  title_color: "#111827",
  align: "left",
  items: [
    {
      enabled: true,
      badge_text: "DEAL",
      badge_bg: "#F97316",
      badge_color: "#ffffff",
      title: "Items At ₹99",
      subtitle: "On select items",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "%",
      badge_bg: "#F97316",
      badge_color: "#ffffff",
      title: "50% Off Upto ₹100",
      subtitle: "Use SWIGGY50",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "%",
      badge_bg: "#F97316",
      badge_color: "#ffffff",
      title: "Flat ₹200 Off",
      subtitle: "Orders above ₹999",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "NEW",
      badge_bg: "#0F172A",
      badge_color: "#ffffff",
      title: "Free Gift",
      subtitle: "On first order",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "%",
      badge_bg: "#F97316",
      badge_color: "#ffffff",
      title: "Bank Offers",
      subtitle: "HDFC / ICICI",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "B1G1",
      badge_bg: "#F97316",
      badge_color: "#ffffff",
      title: "Buy 1 Get 1",
      subtitle: "Today only",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "₹",
      badge_bg: "#0EA5E9",
      badge_color: "#ffffff",
      title: "20% Cashback",
      subtitle: "With PayTM",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "FREE",
      badge_bg: "#16A34A",
      badge_color: "#ffffff",
      title: "Free Delivery",
      subtitle: "Above ₹499",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "ID",
      badge_bg: "#4F46E5",
      badge_color: "#ffffff",
      title: "Student Offer",
      subtitle: "Verify & save",
      href: "#",
    },
    {
      enabled: true,
      badge_text: "%",
      badge_bg: "#F97316",
      badge_color: "#ffffff",
      title: "Festive Sale",
      subtitle: "Ends tonight",
      href: "#",
    },
  ],
  card_radius: 18,
  card_border: true,
  card_border_color: "#E5E7EB",
  card_text_color: "#111827",
  card_subtle_text_color: "#6B7280",
  card_bg: "#ffffff",
  card_shadow: false,
  card_height_px: 72,
  card_horizontal_pad_px: 18,
  gap_px: 14,
  show_arrows_desktop: true,
  show_arrows_mobile: false,
  arrows_bg: "#F3F4F6",
  arrows_fg: "#111827",
  center_rail_ends: false,
  section_background_color: "#ffffff",
  section_top_margin: "0rem",
  section_bottom_margin: "0.75rem",
  custom_css: null,
  visibility: "all",
};

/* ------------------------------------------------------------------ */
/* Collapsible Settings Card                                          */
/* ------------------------------------------------------------------ */

const MainCouponSettingsCard: React.FC<{
  ui: MainCouponUI;
  onChange: (
    next: MainCouponUI | ((prev: MainCouponUI) => MainCouponUI)
  ) => void;
  defaultOpen?: boolean;
}> = ({ ui, onChange, defaultOpen = true }) => {
  const s = useMemo(() => ({ ...defaultMainCouponUI, ...(ui || {}) }), [ui]);

  // robust setter: prefer functional updater when parent passed a React setter
  const set = (patch: Partial<MainCouponUI>) => {
    const fn = onChange as any;
    try {
      // If parent is a state setter, this will work and avoid stale closures
      fn((prev: MainCouponUI) => ({ ...prev, ...patch }));
    } catch {
      // Fallback for plain callback style
      onChange({ ...s, ...patch });
    }
  };

  /* Items editor (JSON) with validation */
  const [itemsText, setItemsText] = useState<string>(
    JSON.stringify(s.items || [], null, 2)
  );
  const [itemsErr, setItemsErr] = useState<string | null>(null);
  useEffect(() => {
    setItemsText(JSON.stringify(s.items || [], null, 2));
  }, [s.items]);

  const applyItems = () => {
    try {
      const arr = JSON.parse(itemsText);
      if (!Array.isArray(arr)) throw new Error("Items should be an array");
      set({ items: arr });
      setItemsErr(null);
    } catch (e: any) {
      setItemsErr(e?.message || "Invalid JSON");
    }
  };

  /* Collapsible */
  const [open, setOpen] = useState<boolean>(!!defaultOpen);

  const enabled = s.enabled !== false;
  const hasAnyItem = (s.items || []).some((i) => i?.enabled !== false);
  const statusOn = enabled && hasAnyItem;

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900">
            Deals / Coupons Rail
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Quickly feature offers and promotions in a horizontal rail.
          </p>
        </div>

        {/* live status dot */}
        <span
          className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
            statusOn ? "bg-emerald-500" : "bg-gray-300"
          }`}
          aria-hidden
        />

        {/* enable switch */}
        <Switch
          checked={enabled}
          onChange={(v) => set({ enabled: v })}
          className="ml-2 mt-0.5"
        />

        {/* collapse */}
        <button
          aria-label={open ? "Collapse" : "Expand"}
          onClick={() => setOpen((v) => !v)}
          className="ml-1 inline-grid h-8 w-8 place-items-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <ChevronUp
            className={`h-4 w-4 transition-transform ${
              !open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Body (collapsible) */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 p-4 sm:p-5 space-y-8">
            {/* Header Group */}
            <Group title="Header">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Show title">
                  <Checkbox
                    checked={s.display_title ?? true}
                    onChange={(v) => set({ display_title: v })}
                  />
                </Field>

                <Field label="Title">
                  <TextInput
                    value={s.title || ""}
                    onChange={(v) => set({ title: v })}
                    placeholder="Deals for you"
                  />
                </Field>

                <Field label="Title color">
                  <ColorInput
                    value={s.title_color || "#111827"}
                    onChange={(v) => set({ title_color: v })}
                  />
                </Field>

                <Field label="Heading alignment">
                  <Select
                    value={s.align || "left"}
                    onChange={(v) => set({ align: v as any })}
                    options={[
                      { label: "Left", value: "left" },
                      { label: "Center", value: "center" },
                      { label: "Right", value: "right" },
                    ]}
                  />
                </Field>
              </div>
            </Group>

            {/* Content Group */}
            <Group title="Content">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">
                Coupons JSON (array of objects)
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 font-mono text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                rows={12}
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
              />
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={applyItems}
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  Apply
                </button>
                {itemsErr ? (
                  <span className="text-red-600 text-sm">{itemsErr}</span>
                ) : (
                  <span className="text-gray-500 text-sm">
                    {hasAnyItem
                      ? `${s.items?.length ?? 0} items`
                      : "No enabled items"}
                  </span>
                )}
              </div>
            </Group>

            {/* Card Group */}
            <Group title="Card">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Corner radius (px)">
                  <NumberInput
                    min={0}
                    max={30}
                    step={1}
                    value={s.card_radius ?? 18}
                    onChange={(v) => set({ card_radius: v })}
                  />
                </Field>

                <Field label="Height (px)">
                  <NumberInput
                    min={56}
                    max={108}
                    step={2}
                    value={s.card_height_px ?? 72}
                    onChange={(v) => set({ card_height_px: v })}
                  />
                </Field>

                <Field label="Horizontal padding (px)">
                  <NumberInput
                    min={8}
                    max={40}
                    step={1}
                    value={s.card_horizontal_pad_px ?? 18}
                    onChange={(v) => set({ card_horizontal_pad_px: v })}
                  />
                </Field>

                <Field label="Gap between cards (px)">
                  <NumberInput
                    min={6}
                    max={32}
                    step={1}
                    value={s.gap_px ?? 14}
                    onChange={(v) => set({ gap_px: v })}
                  />
                </Field>

                <Field label="Card background">
                  <ColorInput
                    value={s.card_bg || "#ffffff"}
                    onChange={(v) => set({ card_bg: v })}
                  />
                </Field>

                <Field label="Border">
                  <Checkbox
                    checked={s.card_border ?? true}
                    onChange={(v) => set({ card_border: v })}
                    label="Show border"
                  />
                </Field>

                <Field label="Border color">
                  <ColorInput
                    value={s.card_border_color || "#E5E7EB"}
                    onChange={(v) => set({ card_border_color: v })}
                    disabled={!s.card_border}
                  />
                </Field>

                <Field label="Soft shadow">
                  <Checkbox
                    checked={s.card_shadow ?? false}
                    onChange={(v) => set({ card_shadow: v })}
                    label="Enable"
                  />
                </Field>

                <Field label="Title color">
                  <ColorInput
                    value={s.card_text_color || "#111827"}
                    onChange={(v) => set({ card_text_color: v })}
                  />
                </Field>

                <Field label="Subtitle color">
                  <ColorInput
                    value={s.card_subtle_text_color || "#6B7280"}
                    onChange={(v) => set({ card_subtle_text_color: v })}
                  />
                </Field>
              </div>
            </Group>

            {/* Arrows & Behavior */}
            <Group title="Arrows & Behavior">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Show arrows on desktop">
                  <Checkbox
                    checked={s.show_arrows_desktop ?? true}
                    onChange={(v) => set({ show_arrows_desktop: v })}
                  />
                </Field>

                <Field label="Show arrows on mobile">
                  <Checkbox
                    checked={s.show_arrows_mobile ?? false}
                    onChange={(v) => set({ show_arrows_mobile: v })}
                  />
                </Field>

                <Field label="Center rail ends">
                  <Checkbox
                    checked={s.center_rail_ends ?? false}
                    onChange={(v) => set({ center_rail_ends: v })}
                    label="Adds side padding"
                  />
                </Field>

                <Field label="Arrows background">
                  <ColorInput
                    value={s.arrows_bg || "#F3F4F6"}
                    onChange={(v) => set({ arrows_bg: v })}
                  />
                </Field>

                <Field label="Arrows icon color">
                  <ColorInput
                    value={s.arrows_fg || "#111827"}
                    onChange={(v) => set({ arrows_fg: v })}
                  />
                </Field>
              </div>
            </Group>

            {/* Section */}
            <Group title="Section">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Background">
                  <ColorInput
                    value={s.section_background_color || "#ffffff"}
                    onChange={(v) => set({ section_background_color: v })}
                  />
                </Field>
                <Field label="Top margin">
                  <TextInput
                    value={s.section_top_margin || "0rem"}
                    onChange={(v) => set({ section_top_margin: v })}
                    placeholder="e.g. 0rem"
                  />
                </Field>
                <Field label="Bottom margin">
                  <TextInput
                    value={s.section_bottom_margin || "0.75rem"}
                    onChange={(v) => set({ section_bottom_margin: v })}
                    placeholder="e.g. 1rem"
                  />
                </Field>
              </div>
            </Group>

            {/* Advanced */}
            <Group title="Advanced">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Custom CSS">
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 font-mono text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    rows={6}
                    value={s.custom_css || ""}
                    onChange={(e) => set({ custom_css: e.target.value })}
                    placeholder=".my-class { color: red }"
                  />
                </Field>

                <Field label="Visibility">
                  <Select
                    value={s.visibility || "all"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(v) => set({ visibility: v as any })}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Desktop", value: "desktop" },
                      { label: "Mobile", value: "mobile" },
                    ]}
                  />
                </Field>
              </div>
            </Group>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCouponSettingsCard;

/* ------------------------------------------------------------------ */
/* Tiny UI helpers                                                     */
/* ------------------------------------------------------------------ */

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border border-gray-200">
      <legend className="px-2 text-xs font-semibold tracking-wide uppercase text-gray-500 select-none">
        {title}
      </legend>
      <div className="p-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[13px] font-medium text-gray-700">{label}</div>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={Number(value ?? 0)}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    />
  );
}

function ColorInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full h-10 p-1 border rounded-lg ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked?: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
      />
      {label ? <span className="text-gray-700">{label}</span> : null}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* Toggle switch used in the card header */
function Switch({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Disable section" : "Enable section"}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
        checked ? "bg-[#3B82F6]" : "bg-gray-300"
      } ${className || ""}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-1 ring-black/10 transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M5.23 12.21a.75.75 0 001.06.02L10 8.67l3.71 3.56a.75.75 0 001.04-1.08l-4.23-4.06a.75.75 0 00-1.04 0L5.21 11.15a.75.75 0 00.02 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
