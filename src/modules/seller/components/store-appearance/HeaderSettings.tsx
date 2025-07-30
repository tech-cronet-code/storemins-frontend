import React from "react";

interface HeaderSettingsProps {
  headerSettings: {
    showAnnouncement: boolean;
    message: string;
    barColor: string;
    fontColor: string;
    showStoreLogo?: boolean;
    storeLogo?: string;     // base64 | url
    showStoreName?: boolean;
    storeName?: string;
    businessMotto?: string;
    contentAlignment?: "left" | "center";
    /** ─── NEW ─── */
    favicon?: string;       // base64 | url
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (data: any) => void;
}

/* ---------------- Re-usable Toggle switch ---------------- */
const Switch: React.FC<{ checked: boolean; onToggle: (v: boolean) => void }> = ({
  checked,
  onToggle,
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={(e) => onToggle(e.target.checked)}
    />
    {/* track */}
    <div
      className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-blue-600
                 transition-colors relative"
    >
      {/* knob */}
      <span
        className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white
                   transition-transform duration-200
                   peer-checked:translate-x-[20px] pointer-events-none"
      />
    </div>
  </label>
);

const HeaderSettings: React.FC<HeaderSettingsProps> = ({
  headerSettings,
  onChange,
}) => {
  const colorKeys = ["barColor", "fontColor"] as const;
  // type ColorKey = (typeof colorKeys)[number];

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5">
      {/* -------- Announcement -------- */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-800">
          Announcement Bar
        </label>
        <Switch
          checked={headerSettings.showAnnouncement}
          onToggle={(v) =>
            onChange({ ...headerSettings, showAnnouncement: v })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Announcement Message
        </label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={headerSettings.message}
          onChange={(e) =>
            onChange({ ...headerSettings, message: e.target.value })
          }
        />
      </div>

      {/* -------- Color pickers -------- */}
      {colorKeys.map((key) => (
        <div key={key}>
          <label className="block mb-1 text-sm font-medium text-gray-800">
            {key === "barColor" ? "Bar Color" : "Font Color"}
          </label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-8 w-8 rounded border"
              value={headerSettings[key]}
              onChange={(e) =>
                onChange({ ...headerSettings, [key]: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={headerSettings[key]}
              onChange={(e) =>
                onChange({ ...headerSettings, [key]: e.target.value })
              }
            />
          </div>
        </div>
      ))}

      {/* -------- Store Branding -------- */}
      <div className="space-y-4">
        <label className="text-base font-semibold text-gray-900">
          Store Branding
        </label>

        {/* Show Store Logo toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800">
            Show Store Logo
          </label>
          <Switch
            checked={headerSettings.showStoreLogo ?? true}
            onToggle={(v) =>
              onChange({ ...headerSettings, showStoreLogo: v })
            }
          />
        </div>

        {/* Logo picker – visible only when showStoreLogo === true */}
        {headerSettings.showStoreLogo && (
          <div className="space-y-1">
            <label className="text-base font-semibold text-gray-900">
              Store logo
            </label>

            <div className="flex items-center gap-4">
              {/* preview */}
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                {headerSettings.storeLogo ? (
                  <img
                    src={headerSettings.storeLogo}
                    alt="Store Logo"
                    className="h-full w-full object-cover"
                    onError={() =>
                      onChange({ ...headerSettings, storeLogo: undefined })
                    }
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

              {/* upload */}
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
                    onChange({
                      ...headerSettings,
                      storeLogo: reader.result as string,
                    });
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>
        )}

        {/* Show Store Name toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800">
            Show Store Name
          </label>
          <Switch
            checked={headerSettings.showStoreName ?? true}
            onToggle={(v) =>
              onChange({ ...headerSettings, showStoreName: v })
            }
          />
        </div>

        {/* Store name input */}
        {headerSettings.showStoreName && (
          <>
            <label className="block text-sm font-medium text-gray-800">
              Store Name
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={headerSettings.storeName || ""}
              onChange={(e) =>
                onChange({ ...headerSettings, storeName: e.target.value })
              }
            />
          </>
        )}

        {/* Content alignment */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Content Alignment
          </label>
          <select
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            value={headerSettings.contentAlignment || "center"}
            onChange={(e) =>
              onChange({
                ...headerSettings,
                contentAlignment:
                  e.target.value === "left" ? "left" : "center",
              })
            }
          >
            <option value="left">Left Aligned</option>
            <option value="center">Center Aligned</option>
          </select>
        </div>
      </div>

    {/* -------- Favicon Section -------- */}
<div className="space-y-5">
  {/* Title and description */}
  <div>
    <label className="text-base font-semibold text-gray-900">Favicon</label>
    <p className="text-sm text-gray-500">
      Favicon should be square and at least{" "}
      <span className="font-medium">48px × 48px</span>.
    </p>
  </div>

  {/* Browser mock preview */}
  <div className="w-full max-w-md rounded-[10px] bg-[#f5f5f5] p-4 shadow-sm border border-gray-200">
    {/* Top bar dots */}
    <div className="mb-2 flex gap-2 pl-1.5">
      <span className="h-3 w-3 rounded-full bg-red-500" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
      <span className="h-3 w-3 rounded-full bg-green-500" />
    </div>

    {/* Favicon + store name row */}
    <div className="flex items-center gap-2.5 rounded-lg bg-white px-4 py-2 shadow-inner border border-gray-100">
      <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
        {headerSettings.favicon ? (
          <img
            src={headerSettings.favicon}
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
        {(headerSettings.storeName || "Your Store") + " - Online Store"}
      </span>
    </div>
  </div>

  {/* Upload section */}
  <div className="flex items-center gap-4">
    <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-300 bg-white flex items-center justify-center shadow">
      {headerSettings.favicon ? (
        <img
          src={headerSettings.favicon}
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

    {/* Buttons */}
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
            onChange({ ...headerSettings, favicon: reader.result as string });
          reader.readAsDataURL(file);
        }}
      />
      {headerSettings.favicon && (
        <button
          type="button"
          onClick={() => onChange({ ...headerSettings, favicon: "" })}
          className="inline-block rounded-md border border-transparent bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
        >
          Remove
        </button>
      )}
    </div>
  </div>
</div>


    </div>
  );
};

export default HeaderSettings;
