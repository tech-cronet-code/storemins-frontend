import React, { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types & defaults (yours, kept intact)                               */
/* ------------------------------------------------------------------ */

export type SPSlot = {
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

export type SocialProofUI = {
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

  item1?: SPSlot;
  item2?: SPSlot;
  item3?: SPSlot;
  item4?: SPSlot;
  item5?: SPSlot;

  custom_css?: string | null;
};

export const defaultSocialProofUI: SocialProofUI = {
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
  item1: {
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
  item2: {
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
  item3: {
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
  item4: {
    enabled: true,
    platform: "Podcasts",
    value: "20+",
    label: "Podcasts",
    icon_img:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23111827'><path d='M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z'/><path d='M5 11a1 1 0 1 0-2 0c0 4.08 3.06 7.44 7 7.93V22h4v-3.07c3.94-.49 7-3.85 7-7.93a1 1 0 1 0-2 0 6 6 0 0 1-12 0z'/></svg>",
    icon_bg: "#F59E0B",
    icon_color: "#111827",
  },
  item5: { enabled: false },
  custom_css: null,
};

/* ------------------------------------------------------------------ */
/* Small UI primitives                                                 */
/* ------------------------------------------------------------------ */

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
      onClick={() => onChange(!checked)}
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
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 p-1 border rounded-lg"
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

/* ------------------------------------------------------------------ */
/* Collapsible item editor                                            */
/* ------------------------------------------------------------------ */

function ItemEditor({
  n,
  slot,
  onChange,
}: {
  n: number;
  slot?: SPSlot;
  onChange: (next: SPSlot) => void;
}) {
  const s = slot || {};
  const [open, setOpen] = useState<boolean>(true);
  const enabled = s.enabled !== false;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Row header */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              enabled ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
          <h4 className="font-semibold text-gray-800">Item #{n}</h4>
          <span className="text-xs text-gray-500">
            {s.platform ? `— ${s.platform}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={enabled}
            onChange={(v) => onChange({ ...s, enabled: v })}
          />
          <button
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((v) => !v)}
            className="inline-grid h-8 w-8 place-items-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <ChevronUp
              className={`h-4 w-4 transition-transform ${
                !open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Platform">
                <TextInput
                  value={s.platform || ""}
                  onChange={(v) => onChange({ ...s, platform: v })}
                  placeholder="Instagram"
                />
              </Field>
              <Field label="Value">
                <TextInput
                  value={s.value || ""}
                  onChange={(v) => onChange({ ...s, value: v })}
                  placeholder="64.1K"
                />
              </Field>
              <Field label="Sub label">
                <TextInput
                  value={s.label || ""}
                  onChange={(v) => onChange({ ...s, label: v })}
                  placeholder="Followers"
                />
              </Field>
              <Field label="Link (optional)">
                <TextInput
                  value={s.href || ""}
                  onChange={(v) => onChange({ ...s, href: v })}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Icon image URL">
                <TextInput
                  value={s.icon_img || ""}
                  onChange={(v) => onChange({ ...s, icon_img: v })}
                  placeholder="https://… (or data:image/svg+xml;utf8,...)"
                />
              </Field>
              <Field label="Remix icon (alt)">
                <TextInput
                  value={s.icon || ""}
                  onChange={(v) => onChange({ ...s, icon: v })}
                  placeholder="ri-instagram-fill"
                />
              </Field>
              <Field label="Icon background (color/gradient)">
                <TextInput
                  value={s.icon_bg || ""}
                  onChange={(v) => onChange({ ...s, icon_bg: v })}
                  placeholder="#1877F2 or linear-gradient(...)"
                />
              </Field>
              <Field label="Icon color">
                <TextInput
                  value={s.icon_color || ""}
                  onChange={(v) => onChange({ ...s, icon_color: v })}
                  placeholder="#ffffff"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Card (collapsible, status dot, switch, improved layout)       */
/* ------------------------------------------------------------------ */

const SocialProofStripSettingsCard: React.FC<{
  ui: SocialProofUI;
  onChange: (next: SocialProofUI) => void;
  defaultOpen?: boolean;
}> = ({ ui, onChange, defaultOpen = true }) => {
  const s = useMemo(() => ({ ...defaultSocialProofUI, ...(ui || {}) }), [ui]);
  const set = (patch: Partial<SocialProofUI>) => onChange({ ...s, ...patch });

  const [open, setOpen] = useState<boolean>(!!defaultOpen);
  const enabled = s.enabled !== false;

  const anyItemOn =
    (s.item1?.enabled ?? false) ||
    (s.item2?.enabled ?? false) ||
    (s.item3?.enabled ?? false) ||
    (s.item4?.enabled ?? false) ||
    (s.item5?.enabled ?? false);

  const statusOn = enabled && anyItemOn;

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900">
            Social Proof Strip
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Display follower counts and badges to build trust.
          </p>
        </div>

        <span
          className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
            statusOn ? "bg-emerald-500" : "bg-gray-300"
          }`}
          aria-hidden
        />

        <Switch
          checked={enabled}
          onChange={(v) => set({ enabled: v })}
          className="ml-2 mt-0.5"
        />

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

      {/* Body */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 p-4 sm:p-5 space-y-8">
            {/* Display */}
            <Group title="Display">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Section background">
                  <ColorInput
                    value={s.section_background_color || "#ffffff"}
                    onChange={(v) => set({ section_background_color: v })}
                  />
                </Field>

                <Field label="Max items (≤ 5)">
                  <NumberInput
                    min={1}
                    max={5}
                    step={1}
                    value={s.max_items ?? 5}
                    onChange={(v) =>
                      set({ max_items: Math.max(1, Math.min(5, v || 1)) })
                    }
                  />
                </Field>

                <Field label="Compact paddings">
                  <Checkbox
                    checked={s.compact ?? true}
                    onChange={(v) => set({ compact: v })}
                    label="Enable"
                  />
                </Field>
              </div>
            </Group>

            {/* Card style */}
            <Group title="Card style">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Card radius (px)">
                  <NumberInput
                    min={0}
                    max={24}
                    step={1}
                    value={s.chip_radius ?? 18}
                    onChange={(v) => set({ chip_radius: v })}
                  />
                </Field>

                <Field label="Card background">
                  <ColorInput
                    value={s.chip_background_color || "#ffffff"}
                    onChange={(v) => set({ chip_background_color: v })}
                  />
                </Field>

                <Field label="Card border">
                  <ColorInput
                    value={s.chip_border_color || "#ECEFF3"}
                    onChange={(v) => set({ chip_border_color: v })}
                  />
                </Field>

                <Field label="Soft shadow">
                  <Checkbox
                    checked={s.chip_shadow ?? true}
                    onChange={(v) => set({ chip_shadow: v })}
                    label="Enable"
                  />
                </Field>

                <Field label="Hover lift">
                  <Checkbox
                    checked={s.hover_lift ?? true}
                    onChange={(v) => set({ hover_lift: v })}
                    label="Enable"
                  />
                </Field>
              </div>
            </Group>

            {/* Icon style */}
            <Group title="Icon style">
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <Field label="Icon size (px)">
                  <NumberInput
                    min={12}
                    max={32}
                    step={1}
                    value={s.icon_size ?? 20}
                    onChange={(v) => set({ icon_size: v })}
                  />
                </Field>
                <Field label="Icon padding (px)">
                  <NumberInput
                    min={6}
                    max={16}
                    step={1}
                    value={s.icon_pad ?? 10}
                    onChange={(v) => set({ icon_pad: v })}
                  />
                </Field>
                <Field label="Icon radius (px)">
                  <NumberInput
                    min={0}
                    max={20}
                    step={1}
                    value={s.icon_radius ?? 12}
                    onChange={(v) => set({ icon_radius: v })}
                  />
                </Field>
              </div>
            </Group>

            {/* Items */}
            <Group title="Items">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <ItemEditor
                    key={n}
                    n={n}
                    slot={(s as any)[`item${n}`]}
                    onChange={(slot) => set({ [`item${n}`]: slot } as any)}
                  />
                ))}
              </div>
            </Group>

            {/* Advanced */}
            <Group title="Advanced">
              <Field label="Custom CSS">
                <textarea
                  className="w-full border rounded-lg px-3 py-2 font-mono text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  rows={6}
                  value={s.custom_css || ""}
                  onChange={(e) => set({ custom_css: e.target.value })}
                  placeholder=".sps-x .chip { border-width: 2px }"
                />
              </Field>
            </Group>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofStripSettingsCard;
