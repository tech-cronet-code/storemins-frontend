// client/src/seller/components/store-appearance/StoreHeroSettings.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";

export interface StoreHeroUI {
  enabled: boolean;
  bgUrl: string;
  logoUrl: string;
  title: string;
  subtitle: string;
  tagline: string[]; // lines
  heightDesktop: number;
  heightMobile: number;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  overlayColor: string;
  overlayOpacity: number; // 0..100
}

export const defaultStoreHeroUI: StoreHeroUI = {
  enabled: true,
  bgUrl:
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
  logoUrl:
    "https://minis-media-assets.swiggy.com/swiggymini/image/upload/h_256,c_fit,fl_lossy,q_auto:eco,f_auto/IMAGE/847486d0-db3e-4d54-bee7-b537747c7ecd/0gZi8UlkP9cWIQrrlQF1u-B63F0C50-8D0C-4529-AC08-1613096E9E43.png",
  title: "Faasos' Signature Wraps & Rolls",
  subtitle: "Extraordinarily Indulgent Wraps",
  tagline: [
    "Crafting delicious, homemade treats daily.",
    "Specialising in artisanal breads, cakes, and pastries that bring a touch of sweetness to your life. 🧁",
  ],
  heightDesktop: 400,
  heightMobile: 240,
  borderRadius: "lg",
  overlayColor: "#000000",
  overlayOpacity: 20,
};

const Switch: React.FC<{
  checked: boolean;
  onToggle: (v: boolean) => void;
}> = ({ checked, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-[#0A84FF]" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

const Field: React.FC<
  React.PropsWithChildren<{ label: string; hint?: string }>
> = ({ label, hint, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-800">{label}</label>
    {children}
    {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
  </div>
);

const Card: React.FC<
  React.PropsWithChildren<{
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    defaultOpen?: boolean;
  }>
> = ({ title, subtitle, right, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {!!subtitle && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {right}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {open && <div className="border-t border-slate-200 p-4">{children}</div>}
    </div>
  );
};

export const StoreHeroSettingsCard: React.FC<{
  ui: StoreHeroUI;
  onChange: (next: StoreHeroUI) => void;
}> = ({ ui, onChange }) => {
  const right = (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          ui.enabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
      />
      <Switch
        checked={ui.enabled}
        onToggle={(v) => onChange({ ...ui, enabled: v })}
      />
    </div>
  );

  const taglineText = useMemo(() => ui.tagline.join("\n"), [ui.tagline]);

  const handleFile = (file: File, key: "bgUrl" | "logoUrl") => {
    const reader = new FileReader();
    reader.onloadend = () =>
      onChange({ ...ui, [key]: String(reader.result || "") } as StoreHeroUI);
    reader.readAsDataURL(file);
  };

  return (
    <Card
      title="Store Hero"
      subtitle="Large cover with logo badge, title, subtitle and tagline."
      right={right}
      defaultOpen={true}
    >
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Background image" hint="Paste an image URL or upload.">
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="https://…"
              value={ui.bgUrl}
              onChange={(e) => onChange({ ...ui, bgUrl: e.target.value })}
            />
            <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
              Upload
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f, "bgUrl");
                }}
              />
            </label>
          </div>
        </Field>

        <Field label="Logo image" hint="Square images work best.">
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="https://…"
              value={ui.logoUrl}
              onChange={(e) => onChange({ ...ui, logoUrl: e.target.value })}
            />
            <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
              Upload
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f, "logoUrl");
                }}
              />
            </label>
          </div>
        </Field>
      </div>

      {/* Texts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Title">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.title}
            onChange={(e) => onChange({ ...ui, title: e.target.value })}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.subtitle}
            onChange={(e) => onChange({ ...ui, subtitle: e.target.value })}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field
          label="Taglines (one per line)"
          hint="Press Enter to create multiple lines."
        >
          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={taglineText}
            onChange={(e) =>
              onChange({
                ...ui,
                tagline: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
      </div>

      {/* Sizes & overlay */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field label="Height (desktop, px)">
          <input
            type="number"
            min={120}
            max={1000}
            step={10}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.heightDesktop}
            onChange={(e) =>
              onChange({ ...ui, heightDesktop: Number(e.target.value || 400) })
            }
          />
        </Field>
        <Field label="Height (mobile, px)">
          <input
            type="number"
            min={120}
            max={800}
            step={10}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.heightMobile}
            onChange={(e) =>
              onChange({ ...ui, heightMobile: Number(e.target.value || 240) })
            }
          />
        </Field>
        <Field label="Corner radius">
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.borderRadius}
            onChange={(e) =>
              onChange({
                ...ui,
                borderRadius:
                  (e.target.value as StoreHeroUI["borderRadius"]) || "lg",
              })
            }
          >
            {["none", "sm", "md", "lg", "xl", "2xl"].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Overlay color">
          <input
            type="color"
            className="h-10 w-16 rounded-lg border border-slate-200"
            value={ui.overlayColor}
            onChange={(e) => onChange({ ...ui, overlayColor: e.target.value })}
          />
        </Field>
        <Field label="Overlay opacity">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={ui.overlayOpacity}
            onChange={(e) =>
              onChange({ ...ui, overlayOpacity: Number(e.target.value) })
            }
          />
        </Field>
      </div>
    </Card>
  );
};
