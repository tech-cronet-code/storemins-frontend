import React from "react";

export type StoreStatsUI = {
  enabled?: boolean;

  alignment: "left" | "center" | "right";
  compact: boolean;
  show_dividers: boolean;
  text_color: string;
  divider_color: string;
  visibility: "all" | "desktop" | "mobile";

  rating_enabled: boolean;
  rating_value: number;
  rating_count: number;

  orders_enabled: boolean;
  orders_value: string;

  loves_enabled: boolean;
  loves_value: number;

  custom1_enabled: boolean;
  custom1_icon: string;
  custom1_label: string;
  custom1_value: string;

  custom2_enabled: boolean;
  custom2_icon: string;
  custom2_label: string;
  custom2_value: string;

  custom_css: string | null;
};

export const defaultStoreStatsUI: StoreStatsUI = {
  enabled: true,
  alignment: "center",
  compact: true,
  show_dividers: true,
  text_color: "#111827",
  divider_color: "#E5E7EB",
  visibility: "all",

  rating_enabled: true,
  rating_value: 4.42,
  rating_count: 92,

  orders_enabled: true,
  orders_value: "1.5k",

  loves_enabled: true,
  loves_value: 279,

  custom1_enabled: false,
  custom1_icon: "ri-flashlight-line",
  custom1_label: "New",
  custom1_value: "",

  custom2_enabled: false,
  custom2_icon: "ri-shield-check-line",
  custom2_label: "Trusted",
  custom2_value: "",

  custom_css: null,
};

export const StoreStatsSettingsCard: React.FC<{
  ui: StoreStatsUI;
  onChange: (ui: StoreStatsUI) => void;
}> = ({ ui, onChange }) => {
  const set = <K extends keyof StoreStatsUI>(k: K, v: StoreStatsUI[K]) =>
    onChange({ ...ui, [k]: v });

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

  const Color: React.FC<{
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Store Stats
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Small row of social proof (rating, orders, follows, custom).
          </p>
        </div>
        <Switch checked={!!ui.enabled} onToggle={(v) => set("enabled", v)} />
      </div>

      <div className="border-t border-slate-200 p-4 space-y-6">
        {/* Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-800">
              Alignment
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.alignment}
              onChange={(e) => set("alignment", e.target.value as any)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">
              Compact spacing
            </div>
            <Switch checked={ui.compact} onToggle={(v) => set("compact", v)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">
              Show dividers
            </div>
            <Switch
              checked={ui.show_dividers}
              onToggle={(v) => set("show_dividers", v)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Color
            label="Text & icon color"
            value={ui.text_color}
            onChange={(hex) => set("text_color", hex)}
          />
          <Color
            label="Divider color"
            value={ui.divider_color}
            onChange={(hex) => set("divider_color", hex)}
          />
        </div>

        {/* Built-in badges */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">
            Built-in badges
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Rating</span>
              <Switch
                checked={ui.rating_enabled}
                onToggle={(v) => set("rating_enabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Orders</span>
              <Switch
                checked={ui.orders_enabled}
                onToggle={(v) => set("orders_enabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">“Love this”</span>
              <Switch
                checked={ui.loves_enabled}
                onToggle={(v) => set("loves_enabled", v)}
              />
            </div>
          </div>
        </div>

        {/* Custom badge #1 */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              Custom badge #1
            </div>
            <Switch
              checked={ui.custom1_enabled}
              onToggle={(v) => set("custom1_enabled", v)}
            />
          </div>
          {ui.custom1_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Icon class (e.g. ri-star-line)"
                value={ui.custom1_icon}
                onChange={(e) => set("custom1_icon", e.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Label"
                value={ui.custom1_label}
                onChange={(e) => set("custom1_label", e.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Value (optional)"
                value={ui.custom1_value}
                onChange={(e) => set("custom1_value", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Custom badge #2 */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              Custom badge #2
            </div>
            <Switch
              checked={ui.custom2_enabled}
              onToggle={(v) => set("custom2_enabled", v)}
            />
          </div>
          {ui.custom2_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Icon class (e.g. ri-shield-check-line)"
                value={ui.custom2_icon}
                onChange={(e) => set("custom2_icon", e.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Label"
                value={ui.custom2_label}
                onChange={(e) => set("custom2_label", e.target.value)}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Value (optional)"
                value={ui.custom2_value}
                onChange={(e) => set("custom2_value", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
