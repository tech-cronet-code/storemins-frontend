import React, { useState } from "react";

export interface HeaderSettingsModel {
  // Announcement bar
  showAnnouncement: boolean;
  message: string;
  barColor: string;
  fontColor: string;

  visibility?: "all" | "desktop" | "mobile";
  marqueeEnabled?: boolean;
  marqueeMode?: "bounce" | "loop";
  marqueeSpeed?: number;

  // Buttons
  leftBtnEnabled: boolean;
  leftBtnText: string;
  leftBtnUrl: string;
  leftBtnNewTab: boolean;

  rightBtnEnabled: boolean;
  rightBtnText: string;
  rightBtnUrl: string;
  rightBtnNewTab: boolean;

  // Branding (local UI)
  showStoreLogo?: boolean;
  storeLogo?: string;
  showStoreName?: boolean;
  storeName?: string;
  contentAlignment?: "left" | "center";
  favicon?: string;
}

interface HeaderSettingsProps {
  headerSettings: HeaderSettingsModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (data: any) => void;
}

/* ---------------- Reusable Switch ---------------- */
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

/* ---------------- Color field ---------------- */
const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (hex: string) => void;
}> = ({ label, value, onChange }) => {
  const normalize = (v: string) => {
    const x = v.trim().replace(/[^0-9a-fA-F]/g, "");
    return "#" + x.slice(0, 6).padEnd(6, "0");
  };
  return (
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
          value={value}
          onChange={(e) => onChange(normalize(e.target.value))}
          className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-wider"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="text-sm font-semibold text-slate-900">{children}</div>;

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

const HeaderSettings: React.FC<HeaderSettingsProps> = ({
  headerSettings,
  onChange,
}) => {
  const hs = headerSettings;

  /* -------------------------------- Announcement Bar card ------------------------------- */
  const announcementRight = (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          hs.showAnnouncement ? "bg-emerald-500" : "bg-slate-300"
        }`}
      />
      <Switch
        checked={hs.showAnnouncement}
        onToggle={(v) => onChange({ ...hs, showAnnouncement: v })}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card
        title="Announcement Bar"
        subtitle="Quickly communicate offers or updates to visitors."
        right={announcementRight}
        defaultOpen
      >
        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">
            Announcement Message
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30"
            value={hs.message}
            onChange={(e) => onChange({ ...hs, message: e.target.value })}
            placeholder="Write a short announcement…"
          />
        </div>

        {/* Visibility + Marquee */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Visibility */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">
              Visibility
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30"
              value={hs.visibility || "all"}
              onChange={(e) =>
                onChange({
                  ...hs,
                  visibility:
                    e.target.value === "desktop"
                      ? "desktop"
                      : e.target.value === "mobile"
                      ? "mobile"
                      : "all",
                })
              }
            >
              <option value="all">Both (Desktop &amp; Mobile)</option>
              <option value="desktop">Desktop only</option>
              <option value="mobile">Mobile only</option>
            </select>
            <p className="text-xs text-slate-500">
              Choose the devices where the announcement bar appears.
            </p>
          </div>

          {/* Marquee */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <SectionLabel>Marquee</SectionLabel>
              <Switch
                checked={!!hs.marqueeEnabled}
                onToggle={(v) => onChange({ ...hs, marqueeEnabled: v })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Mode
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30 disabled:opacity-50"
                  disabled={!hs.marqueeEnabled}
                  value={hs.marqueeMode || "bounce"}
                  onChange={(e) =>
                    onChange({
                      ...hs,
                      marqueeMode:
                        e.target.value === "loop" ? "loop" : "bounce",
                    })
                  }
                >
                  <option value="bounce">Bounce (left ↔ right)</option>
                  <option value="loop">Loop (left → left)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Speed
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                  disabled={!hs.marqueeEnabled}
                  value={hs.marqueeSpeed ?? 5}
                  onChange={(e) =>
                    onChange({ ...hs, marqueeSpeed: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Enable scrolling text and adjust speed/mode.
            </p>
          </div>
        </div>

        {/* Colors */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ColorField
            label="Bar Color"
            value={hs.barColor}
            onChange={(hex) => onChange({ ...hs, barColor: hex })}
          />
          <ColorField
            label="Font Color"
            value={hs.fontColor}
            onChange={(hex) => onChange({ ...hs, fontColor: hex })}
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <SectionLabel>Buttons</SectionLabel>
          <p className="text-xs text-slate-500">
            Optional actions you can place on the bar.
          </p>

          {/* Left Button */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-900">
                Left Button
              </div>
              <Switch
                checked={hs.leftBtnEnabled}
                onToggle={(v) => onChange({ ...hs, leftBtnEnabled: v })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Text
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30 disabled:opacity-50"
                  placeholder="e.g. FREE SHIPPING"
                  disabled={!hs.leftBtnEnabled}
                  value={hs.leftBtnText}
                  onChange={(e) =>
                    onChange({ ...hs, leftBtnText: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  URL
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30 disabled:opacity-50"
                  placeholder="https://example.com/promo"
                  disabled={!hs.leftBtnEnabled}
                  value={hs.leftBtnUrl}
                  onChange={(e) =>
                    onChange({ ...hs, leftBtnUrl: e.target.value })
                  }
                />
              </div>
              <label className="mt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  disabled={!hs.leftBtnEnabled}
                  checked={!!hs.leftBtnNewTab}
                  onChange={(e) =>
                    onChange({ ...hs, leftBtnNewTab: e.target.checked })
                  }
                />
                <span className="text-sm text-slate-700">Open in new tab</span>
              </label>
            </div>
          </div>

          {/* Right Button */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-900">
                Right Button
              </div>
              <Switch
                checked={hs.rightBtnEnabled}
                onToggle={(v) => onChange({ ...hs, rightBtnEnabled: v })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Text
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30 disabled:opacity-50"
                  placeholder="e.g. SHOP NOW"
                  disabled={!hs.rightBtnEnabled}
                  value={hs.rightBtnText}
                  onChange={(e) =>
                    onChange({ ...hs, rightBtnText: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  URL
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF]/30 disabled:opacity-50"
                  placeholder="https://example.com/collection"
                  disabled={!hs.rightBtnEnabled}
                  value={hs.rightBtnUrl}
                  onChange={(e) =>
                    onChange({ ...hs, rightBtnUrl: e.target.value })
                  }
                />
              </div>
              <label className="mt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  disabled={!hs.rightBtnEnabled}
                  checked={!!hs.rightBtnNewTab}
                  onChange={(e) =>
                    onChange({ ...hs, rightBtnNewTab: e.target.checked })
                  }
                />
                <span className="text-sm text-slate-700">Open in new tab</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* -------------------------------- Branding & Favicon card ------------------------------- */}
      <Card
        title="Branding & Header"
        subtitle="Header visuals shown on your storefront."
        defaultOpen={false}
      >
        {/* Show Store Logo toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800">
            Show Store Logo
          </label>
          <Switch
            checked={hs.showStoreLogo ?? true}
            onToggle={(v) => onChange({ ...hs, showStoreLogo: v })}
          />
        </div>

        {/* Logo picker */}
        {hs.showStoreLogo && (
          <div className="mt-3 space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Store logo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                {hs.storeLogo ? (
                  <img
                    src={hs.storeLogo}
                    alt="Store Logo"
                    className="h-full w-full object-cover"
                    onError={() => onChange({ ...hs, storeLogo: undefined })}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75m-18 0L4.5 4.5h15l1.5 5.25m-18 0h18"
                    />
                  </svg>
                )}
              </div>

              <label
                htmlFor="storeLogoUpload"
                className="cursor-pointer select-none rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
              >
                Update image
              </label>
              <input
                id="storeLogoUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    onChange({ ...hs, storeLogo: reader.result as string });
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>
        )}

        {/* Show Store Name toggle */}
        <div className="mt-4 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800">
            Show Store Name
          </label>
          <Switch
            checked={hs.showStoreName ?? true}
            onToggle={(v) => onChange({ ...hs, showStoreName: v })}
          />
        </div>

        {/* Store name */}
        {hs.showStoreName && (
          <>
            <label className="mt-2 block text-sm font-medium text-gray-800">
              Store Name
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={hs.storeName || ""}
              onChange={(e) => onChange({ ...hs, storeName: e.target.value })}
            />
          </>
        )}

        {/* Alignment */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-800">
            Content Alignment
          </label>
          <select
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            value={hs.contentAlignment || "center"}
            onChange={(e) =>
              onChange({
                ...hs,
                contentAlignment: e.target.value === "left" ? "left" : "center",
              })
            }
          >
            <option value="left">Left Aligned</option>
            <option value="center">Center Aligned</option>
          </select>
        </div>

        {/* Favicon */}
        <div className="mt-6 space-y-3">
          <div>
            <label className="text-base font-semibold text-gray-900">
              Favicon
            </label>
            <p className="text-sm text-gray-500">
              Favicon should be square and at least{" "}
              <span className="font-medium">48px × 48px</span>.
            </p>
          </div>

          <div className="w-full max-w-md rounded-[10px] bg-[#f5f5f5] p-4 shadow-sm border border-gray-200">
            <div className="mb-2 flex gap-2 pl-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            <div className="flex items-center gap-2.5 rounded-lg bg-white px-4 py-2 shadow-inner border border-gray-100">
              <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                {hs.favicon ? (
                  <img
                    src={hs.favicon}
                    alt="Favicon preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 9.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75m-18 0L4.5 4.5h15l1.5 5.25m-18 0h18"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-gray-800 truncate">
                {(hs.storeName || "Your Store") + " - Online Store"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-300 bg-white flex items-center justify-center shadow">
              {hs.favicon ? (
                <img
                  src={hs.favicon}
                  alt="Favicon thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75m-18 0L4.5 4.5h15l1.5 5.25m-18 0h18"
                  />
                </svg>
              )}
            </div>

            <div className="space-x-2">
              <label
                htmlFor="faviconUpload"
                className="inline-block cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
              >
                Change Image
              </label>
              <input
                id="faviconUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    onChange({ ...hs, favicon: reader.result as string });
                  reader.readAsDataURL(file);
                }}
              />
              {hs.favicon && (
                <button
                  type="button"
                  onClick={() => onChange({ ...hs, favicon: "" })}
                  className="inline-block rounded-md border border-transparent bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeaderSettings;
