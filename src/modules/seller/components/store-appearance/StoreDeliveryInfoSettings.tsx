import React from "react";

/* =========================
   Types & Defaults (UI)
   ========================= */

export type StoreDeliveryInfoUI = {
  enabled?: boolean;

  background_color: string; // editor-only (renderer defaults to white; still respected)
  text_color: string;
  accent_color: string;

  align: "left" | "center" | "right";
  show_dividers: boolean;

  min_days: number;
  max_days: number;
  store_name: string;

  custom_css: string | null;
  visibility: "all" | "desktop" | "mobile";
};

export const defaultStoreDeliveryInfoUI: StoreDeliveryInfoUI = {
  enabled: true,
  background_color: "#ffffff",
  text_color: "#111827",
  accent_color: "#7c3aed",
  align: "left",
  show_dividers: true,
  min_days: 1,
  max_days: 5,
  store_name: "",
  custom_css: null,
  visibility: "all",
};

/* =========================
   Server mappers (optional)
   ========================= */

export type StoreDeliveryInfoServerSettings = {
  background_color?: string;
  text_color?: string;
  accent_color?: string;
  align?: "left" | "center" | "right";
  show_dividers?: boolean;
  min_days?: number;
  max_days?: number;
  store_name?: string;
  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

/** Convert server payload -> UI state */
export function mapDeliveryInfoToUI(
  s?: StoreDeliveryInfoServerSettings,
  enabledFlag?: number | boolean
): StoreDeliveryInfoUI {
  return {
    ...defaultStoreDeliveryInfoUI,
    enabled:
      typeof enabledFlag === "number"
        ? enabledFlag !== 0
        : typeof enabledFlag === "boolean"
        ? enabledFlag
        : true,
    background_color:
      s?.background_color ?? defaultStoreDeliveryInfoUI.background_color,
    text_color: s?.text_color ?? defaultStoreDeliveryInfoUI.text_color,
    accent_color: s?.accent_color ?? defaultStoreDeliveryInfoUI.accent_color,
    align:
      (s?.align as StoreDeliveryInfoUI["align"]) ??
      defaultStoreDeliveryInfoUI.align,
    show_dividers: s?.show_dividers ?? defaultStoreDeliveryInfoUI.show_dividers,
    min_days:
      typeof s?.min_days === "number"
        ? s.min_days
        : defaultStoreDeliveryInfoUI.min_days,
    max_days:
      typeof s?.max_days === "number"
        ? s.max_days
        : defaultStoreDeliveryInfoUI.max_days,
    store_name: s?.store_name ?? defaultStoreDeliveryInfoUI.store_name,
    custom_css: s?.custom_css ?? defaultStoreDeliveryInfoUI.custom_css,
    visibility:
      (s?.visibility as StoreDeliveryInfoUI["visibility"]) ??
      defaultStoreDeliveryInfoUI.visibility,
  };
}

/** Merge UI state -> server payload */
export function mergeDeliveryInfoFromUI(
  existing: StoreDeliveryInfoServerSettings | undefined,
  ui: StoreDeliveryInfoUI
): StoreDeliveryInfoServerSettings {
  return {
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
  };
}

/* =========================
   Reusable atoms
   ========================= */

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

const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (hex: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-slate-800">{label}</div>
    <div className="flex items-center gap-3">
      <input
        type="color"
        className="h-10 w-10 rounded-lg border border-slate-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-wider"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

/* =========================
   Settings Card
   ========================= */

export const StoreDeliveryInfoSettingsCard: React.FC<{
  ui: StoreDeliveryInfoUI;
  onChange: (ui: StoreDeliveryInfoUI) => void;
}> = ({ ui, onChange }) => {
  const set = <K extends keyof StoreDeliveryInfoUI>(
    k: K,
    v: StoreDeliveryInfoUI[K]
  ) => onChange({ ...ui, [k]: v });

  // clamp helpers
  const clamp = (n: number, lo: number, hi: number) =>
    Math.min(Math.max(n, lo), hi);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Store Delivery Info
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Show delivery ETA by pincode with your accent color and store name.
          </p>
        </div>
        <Switch checked={!!ui.enabled} onToggle={(v) => set("enabled", v)} />
      </div>

      {/* Body */}
      <div className="border-t border-slate-200 p-4 space-y-6">
        {/* Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-800">
              Alignment
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.align}
              onChange={(e) =>
                set("align", e.target.value as StoreDeliveryInfoUI["align"])
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">
              Top/Bottom divider
            </div>
            <Switch
              checked={ui.show_dividers}
              onToggle={(v) => set("show_dividers", v)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">
              Visibility
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.visibility}
              onChange={(e) =>
                set(
                  "visibility",
                  e.target.value as StoreDeliveryInfoUI["visibility"]
                )
              }
            >
              <option value="all">All</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ColorField
            label="Background"
            value={ui.background_color}
            onChange={(v) => set("background_color", v)}
          />
          <ColorField
            label="Text"
            value={ui.text_color}
            onChange={(v) => set("text_color", v)}
          />
          <ColorField
            label="Accent"
            value={ui.accent_color}
            onChange={(v) => set("accent_color", v)}
          />
        </div>

        {/* Behavior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-800">
              Min days
            </label>
            <input
              type="number"
              min={1}
              max={10}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.min_days}
              onChange={(e) => {
                const v = clamp(Number(e.target.value || 1), 1, 10);
                set("min_days", v);
                if (ui.max_days < v) set("max_days", v);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              Max days
            </label>
            <input
              type="number"
              min={1}
              max={30}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.max_days}
              onChange={(e) => {
                const v = clamp(Number(e.target.value || ui.min_days), 1, 30);
                set("max_days", Math.max(v, ui.min_days));
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">
              Store override (optional)
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g. Nomi"
              value={ui.store_name}
              onChange={(e) => set("store_name", e.target.value)}
            />
          </div>
        </div>

        {/* Advanced */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-800">
              Custom CSS
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder={`/* optional */`}
              value={ui.custom_css || ""}
              onChange={(e) => set("custom_css", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDeliveryInfoSettingsCard;
