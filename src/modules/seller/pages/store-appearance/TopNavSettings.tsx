// client/src/seller/pages/appearance/TopNavSettings.tsx
import React, { useState } from "react";
import {
  mapTopNavToUI,
  type TopNavSettings,
} from "../../../../shared/blocks/topNav";

export type TopNavUI = ReturnType<typeof mapTopNavToUI>;
export { mapTopNavToUI } from "../../../../shared/blocks/topNav"; // re-export for external use

/* ------------------ small primitives ------------------ */

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm font-medium text-slate-800">{children}</div>
);

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

const ColorInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="color"
      className="h-10 w-10 rounded-lg border border-slate-200"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-wider"
      placeholder="#000000"
    />
  </div>
);

/** Collapsible card shell (same style as Announcement/Branding cards) */
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

/* ------------------ TopNav settings card ------------------ */

export const TopNavSettingsCard: React.FC<{
  ui: TopNavUI;
  onChange: (ui: TopNavUI) => void;
}> = ({ ui, onChange }) => {
  // treat undefined as enabled by default
  const enabled = ui.enabled ?? true;

  const headerRight = (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          enabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
      />
      <Switch
        checked={enabled}
        onToggle={(v) => onChange({ ...ui, enabled: v } as TopNavUI)}
      />
    </div>
  );

  return (
    <Card
      title="Menu (Top Navigation)"
      subtitle="Header navigation and quick actions."
      right={headerRight}
      defaultOpen
    >
      {/* Quick toggles */}
      <div>
        <FieldLabel>Quick toggles</FieldLabel>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ["Search", "showSearch"],
            ["Cart", "showCart"],
            ["Wishlist", "showWishlist"],
            ["WhatsApp", "showWhatsApp"],
            ["Profile", "showProfile"],
          ].map(([label, key]) => (
            <label key={key} className="flex items-center gap-3">
              <Switch
                checked={(ui as any)[key]}
                onToggle={(v) => onChange({ ...ui, [key]: v } as TopNavUI)}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>

        {ui.showWhatsApp && (
          <div className="mt-3">
            <FieldLabel>WhatsApp number/link</FieldLabel>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="+91XXXXXXXXXX or https://wa.me/…"
              value={ui.whatsappNumber}
              onChange={(e) =>
                onChange({ ...ui, whatsappNumber: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Appearance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <FieldLabel>Background color</FieldLabel>
          <div className="mt-2">
            <ColorInput
              value={ui.backgroundColor}
              onChange={(v) => onChange({ ...ui, backgroundColor: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Icon & label color</FieldLabel>
          <div className="mt-2">
            <ColorInput
              value={ui.textColor}
              onChange={(v) => onChange({ ...ui, textColor: v })}
            />
          </div>
        </div>

        <label className="flex items-center gap-3">
          <Switch
            checked={ui.sticky}
            onToggle={(v) => onChange({ ...ui, sticky: v })}
          />
          <span className="text-sm">Sticky header (desktop)</span>
        </label>

        <div>
          <FieldLabel>Visibility</FieldLabel>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.visibility}
            onChange={(e) =>
              onChange({
                ...ui,
                visibility:
                  e.target.value === "desktop"
                    ? "desktop"
                    : e.target.value === "mobile"
                    ? "mobile"
                    : "all",
              })
            }
          >
            <option value="all">Both (Desktop & Mobile)</option>
            <option value="desktop">Desktop only</option>
            <option value="mobile">Mobile only</option>
          </select>
        </div>
      </div>

      {/* Search pill */}
      <div className="space-y-3 mt-6">
        <FieldLabel>Search pill</FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-slate-600">
              Placeholder
            </div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.placeholder}
              onChange={(e) => onChange({ ...ui, placeholder: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-3">
            <Switch
              checked={ui.searchShowIcon}
              onToggle={(v) => onChange({ ...ui, searchShowIcon: v })}
            />
            <span className="text-sm">Show icon in pill</span>
          </label>

          <div>
            <div className="text-xs font-medium text-slate-600">Search BG</div>
            <div className="mt-1">
              <ColorInput
                value={ui.searchBg}
                onChange={(v) => onChange({ ...ui, searchBg: v })}
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600">
              Placeholder color
            </div>
            <div className="mt-1">
              <ColorInput
                value={ui.searchPhColor}
                onChange={(v) => onChange({ ...ui, searchPhColor: v })}
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600">Border</div>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.border ? "on" : "off"}
              onChange={(e) =>
                onChange({ ...ui, border: e.target.value === "on" })
              }
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>

          {ui.border && (
            <>
              <div>
                <div className="text-xs font-medium text-slate-600">
                  Border size
                </div>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.borderSize}
                  onChange={(e) =>
                    onChange({
                      ...ui,
                      borderSize: e.target
                        .value as TopNavSettings["desktop_search_bar_border_size"],
                    })
                  }
                >
                  {["0px", "1px", "2px", "3px", "4px", "6px"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600">
                  Border color
                </div>
                <div className="mt-1">
                  <ColorInput
                    value={ui.borderColor}
                    onChange={(v) => onChange({ ...ui, borderColor: v })}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <div className="text-xs font-medium text-slate-600">
              Corner radius
            </div>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.radius}
              onChange={(e) =>
                onChange({
                  ...ui,
                  radius: e.target.value as NonNullable<
                    TopNavSettings["desktop_search_bar_radius"]
                  >,
                })
              }
            >
              {["none", "sm", "md", "lg", "xl", "full"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <FieldLabel>Left button</FieldLabel>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.leftButton}
            onChange={(e) =>
              onChange({
                ...ui,
                leftButton: e.target.value as NonNullable<
                  TopNavSettings["left_button"]
                >,
              })
            }
          >
            {["NONE", "BRANCH", "SEARCH", "ACCOUNT", "CART", "MENU"].map(
              (o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <FieldLabel>Right button</FieldLabel>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.rightButton}
            onChange={(e) =>
              onChange({
                ...ui,
                rightButton: e.target.value as NonNullable<
                  TopNavSettings["right_button"]
                >,
              })
            }
          >
            {["NONE", "BRANCH", "SEARCH", "ACCOUNT", "CART", "MENU"].map(
              (o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Custom links */}
      <div className="mt-6">
        <FieldLabel>Custom links</FieldLabel>
        <div className="mt-2 space-y-2">
          {(ui.menuItems || []).map((it, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Label"
                value={it.label || ""}
                onChange={(e) => {
                  const next = [...ui.menuItems];
                  next[i] = { ...next[i], label: e.target.value };
                  onChange({ ...ui, menuItems: next });
                }}
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://example.com"
                value={it.href || ""}
                onChange={(e) => {
                  const next = [...ui.menuItems];
                  next[i] = { ...next[i], href: e.target.value };
                  onChange({ ...ui, menuItems: next });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="mt-2 rounded-md border px-3 py-1.5 text-sm"
            onClick={() =>
              onChange({
                ...ui,
                menuItems: [...(ui.menuItems || []), { label: "", href: "" }],
              })
            }
          >
            + Add link
          </button>
        </div>
      </div>
    </Card>
  );
};
