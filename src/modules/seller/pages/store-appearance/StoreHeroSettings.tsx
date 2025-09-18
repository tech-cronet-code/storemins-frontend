import React from "react";

/** Editor-side UI model for the Store Hero */
export type StoreHeroUI = {
  bgUrl: string;
  objectPosition: string;
  heightDesktop: number;
  heightMobile: number;
  radius: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  overlayColor: string;
  overlayOpacity: number; // 0..100

  showLogo: boolean;
  logoUrl: string;
  logoSize: number;
  logoShape: "rounded" | "circle" | "square";
  logoPadding: number;
  logoShadow: boolean;

  showChip: boolean;
  chipText: string;
  chipLink: string;
  chipShowIcon: boolean;
  chipIconUrl: string;

  insetPadding: number;
  visibility: "all" | "desktop" | "mobile";
  customCss?: string | null;
};

export const StoreHeroSettingsCard: React.FC<{
  ui: StoreHeroUI;
  onChange: (next: StoreHeroUI) => void;
}> = ({ ui, onChange }) => {
  const set = <K extends keyof StoreHeroUI>(k: K, v: StoreHeroUI[K]) =>
    onChange({ ...ui, [k]: v });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Store Hero</h3>
          <p className="mt-1 text-xs text-slate-500">
            Big visual header below your menu.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 space-y-6">
        {/* Background */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">
            Background image URL
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ui.bgUrl}
            onChange={(e) => set("bgUrl", e.target.value)}
            placeholder="https://…"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Object position (CSS)
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={ui.objectPosition}
                onChange={(e) => set("objectPosition", e.target.value)}
                placeholder="center, 50% 40%, left top…"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Height (desktop, px)
              </label>
              <input
                type="number"
                min={120}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={ui.heightDesktop}
                onChange={(e) =>
                  set("heightDesktop", Number(e.target.value || 0))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Height (mobile, px)
              </label>
              <input
                type="number"
                min={120}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={ui.heightMobile}
                onChange={(e) =>
                  set("heightMobile", Number(e.target.value || 0))
                }
              />
            </div>
          </div>
        </div>

        {/* Corner radius & inset */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Corner radius
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.radius}
              onChange={(e) =>
                set("radius", (e.target.value as StoreHeroUI["radius"]) || "lg")
              }
            >
              {["none", "sm", "md", "lg", "xl", "2xl"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Edge padding (px)
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.insetPadding}
              onChange={(e) => set("insetPadding", Number(e.target.value || 0))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Visibility
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ui.visibility}
              onChange={(e) =>
                set(
                  "visibility",
                  (e.target.value as StoreHeroUI["visibility"]) || "all"
                )
              }
            >
              <option value="all">Both (Desktop & Mobile)</option>
              <option value="desktop">Desktop only</option>
              <option value="mobile">Mobile only</option>
            </select>
          </div>
        </div>

        {/* Overlay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-800">
              Overlay color
            </label>
            <input
              type="color"
              className="h-10 w-14 rounded-lg border border-slate-200"
              value={ui.overlayColor}
              onChange={(e) => set("overlayColor", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">
              Overlay opacity (%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={ui.overlayOpacity}
              onChange={(e) => set("overlayOpacity", Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Logo badge */}
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">Logo badge</div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ui.showLogo}
                onChange={(e) => set("showLogo", e.target.checked)}
              />
              Show
            </label>
          </div>
          {ui.showLogo && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600">
                  Logo URL
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.logoUrl}
                  onChange={(e) => set("logoUrl", e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Size (px)
                </label>
                <input
                  type="number"
                  min={36}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.logoSize}
                  onChange={(e) => set("logoSize", Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Padding (px)
                </label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.logoPadding}
                  onChange={(e) =>
                    set("logoPadding", Number(e.target.value || 0))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Shape
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.logoShape}
                  onChange={(e) =>
                    set(
                      "logoShape",
                      (e.target.value as StoreHeroUI["logoShape"]) || "rounded"
                    )
                  }
                >
                  <option value="rounded">Rounded</option>
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                </select>
              </div>
              <label className="mt-6 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={ui.logoShadow}
                  onChange={(e) => set("logoShadow", e.target.checked)}
                />
                Shadow
              </label>
            </div>
          )}
        </div>

        {/* “Made with” chip */}
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              “Made with” chip
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ui.showChip}
                onChange={(e) => set("showChip", e.target.checked)}
              />
              Show
            </label>
          </div>
          {ui.showChip && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Text
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.chipText}
                  onChange={(e) => set("chipText", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Link
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.chipLink}
                  onChange={(e) => set("chipLink", e.target.value)}
                />
              </div>
              <label className="mt-6 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={ui.chipShowIcon}
                  onChange={(e) => set("chipShowIcon", e.target.checked)}
                />
                Show icon
              </label>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600">
                  Icon URL
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={ui.chipIconUrl}
                  onChange={(e) => set("chipIconUrl", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
