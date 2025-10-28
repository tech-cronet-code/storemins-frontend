import React, { useMemo, useState } from "react";

/* -------------------------------- Types ---------------------------------- */
export type OffersCollectionsUI = {
  enabled?: boolean;

  // header
  show_header?: boolean;
  title?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";

  // content
  images?: string[];
  items?: Array<{
    image: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    ctaLabel?: string;
    href?: string;
    gradient?: string;
  }>;

  // card look
  radius?: number;
  height_mobile_px?: number;
  height_desktop_px?: number;
  overlay_gradient?: string;
  show_cta?: boolean;
  cta_label_default?: string;

  // section
  section_background_color?: string;
  section_background_image?: string; // NEW
  section_background_tint?: string; // NEW

  // mobile dots
  show_dots_mobile?: boolean;

  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

export const defaultOffersCollectionsUI: OffersCollectionsUI = {
  enabled: true,
  show_header: true,
  title: "Explore offers",
  subtitle: "Handpicked promos & popular collections",
  align: "left",
  images: [
    "https://images.unsplash.com/photo-1604908554007-4b0b1b2d9a8b?w=1600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80&auto=format&fit=crop",
  ],
  items: [],
  radius: 16,
  height_mobile_px: 160,
  height_desktop_px: 180,
  overlay_gradient:
    "linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.65) 100%)",
  show_cta: true,
  cta_label_default: "Explore",
  section_background_color: "#ffffff",
  section_background_image: "",
  section_background_tint: "rgba(255,255,255,0.88)",
  show_dots_mobile: true,
  custom_css: null,
  visibility: "all",
};

/* ------------------------- small primitives ------------------------------ */
const Switch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
      checked ? "bg-[#3B82F6]" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-1 ring-black/10 transition ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);
const ChevronUp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M5.23 12.21a.75.75 0 001.06.02L10 8.67l3.71 3.56a.75.75 0 001.04-1.08l-4.23-4.06a.75.75 0 00-1.04 0L5.21 11.15a.75.75 0 00.02 1.06z"
      clipRule="evenodd"
    />
  </svg>
);

/* --------------------------------- Card ---------------------------------- */
const OffersCollectionsSettingsCard: React.FC<{
  ui: OffersCollectionsUI;
  onChange: (next: OffersCollectionsUI) => void;
  defaultOpen?: boolean;
}> = ({ ui, onChange, defaultOpen = true }) => {
  const s = useMemo(
    () => ({ ...defaultOffersCollectionsUI, ...(ui || {}) }),
    [ui]
  );
  const set = (patch: Partial<OffersCollectionsUI>) =>
    onChange({ ...s, ...patch });

  const [open, setOpen] = useState<boolean>(!!defaultOpen);
  const [imagesText, setImagesText] = useState<string>(
    JSON.stringify(s.images || [], null, 2)
  );
  const [itemsText, setItemsText] = useState<string>(
    JSON.stringify(s.items || [], null, 2)
  );
  const [err, setErr] = useState<string | null>(null);

  const statusOn =
    s.enabled !== false &&
    ((s.images?.length || 0) > 0 || (s.items?.length || 0) > 0);

  const applyImages = () => {
    try {
      const arr = JSON.parse(imagesText);
      if (!Array.isArray(arr))
        throw new Error("Images should be an array of URLs");
      set({ images: arr as string[] });
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Invalid JSON for images");
    }
  };

  const applyItems = () => {
    try {
      const arr = JSON.parse(itemsText);
      if (!Array.isArray(arr)) throw new Error("Items should be an array");
      set({ items: arr as any[] });
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Invalid JSON for items");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* header row */}
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900">
            Offers / Collections
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Promote curated deals or popular collections with images.
          </p>
        </div>

        <span
          className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
            statusOn ? "bg-emerald-500" : "bg-gray-300"
          }`}
        />

        <Switch
          checked={s.enabled !== false}
          onChange={(v) => set({ enabled: v })}
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

      {/* body */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 p-4 sm:p-5 space-y-8">
            {/* Header */}
            <fieldset className="rounded-lg border border-gray-200">
              <legend className="px-2 text-xs font-semibold uppercase text-gray-500">
                Header
              </legend>
              <div className="p-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={s.show_header ?? true}
                    onChange={(e) => set({ show_header: e.target.checked })}
                  />
                  Show header
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">Title</div>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.title || ""}
                    onChange={(e) => set({ title: e.target.value })}
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">Subtitle</div>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.subtitle || ""}
                    onChange={(e) => set({ subtitle: e.target.value })}
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">Align</div>
                  <select
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.align || "left"}
                    onChange={(e) => set({ align: e.target.value as any })}
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                  </select>
                </label>
              </div>
            </fieldset>

            {/* Pictures */}
            <fieldset className="rounded-lg border border-gray-200">
              <legend className="px-2 text-xs font-semibold uppercase text-gray-500">
                Pictures
              </legend>
              <div className="p-4 space-y-4">
                <div>
                  <div className="mb-1 text-[13px] font-medium">
                    Images JSON (string[])
                  </div>
                  <textarea
                    className="w-full rounded-lg border px-3 py-2 font-mono text-xs"
                    rows={6}
                    value={imagesText}
                    onChange={(e) => setImagesText(e.target.value)}
                  />
                  <div className="mt-2">
                    <button
                      onClick={applyImages}
                      className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[13px] font-medium">
                    Advanced items JSON (image, title, subtitle, badge,
                    ctaLabel, href, gradient)
                  </div>
                  <textarea
                    className="w-full rounded-lg border px-3 py-2 font-mono text-xs"
                    rows={8}
                    value={itemsText}
                    onChange={(e) => setItemsText(e.target.value)}
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={applyItems}
                      className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm"
                    >
                      Apply
                    </button>
                    {err && <span className="text-sm text-red-600">{err}</span>}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Card */}
            <fieldset className="rounded-lg border border-gray-200">
              <legend className="px-2 text-xs font-semibold uppercase text-gray-500">
                Card
              </legend>
              <div className="p-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">
                    Corner radius (px)
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={32}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.radius ?? 16}
                    onChange={(e) =>
                      set({ radius: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">
                    Height mobile (px)
                  </div>
                  <input
                    type="number"
                    min={120}
                    max={280}
                    step={10}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.height_mobile_px ?? 160}
                    onChange={(e) =>
                      set({ height_mobile_px: Number(e.target.value) || 160 })
                    }
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">
                    Height desktop (px)
                  </div>
                  <input
                    type="number"
                    min={140}
                    max={360}
                    step={10}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.height_desktop_px ?? 180}
                    onChange={(e) =>
                      set({ height_desktop_px: Number(e.target.value) || 180 })
                    }
                  />
                </label>
                <label className="block md:col-span-2">
                  <div className="mb-1 text-[13px] font-medium">
                    Overlay gradient (CSS)
                  </div>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.overlay_gradient || ""}
                    onChange={(e) => set({ overlay_gradient: e.target.value })}
                    placeholder="linear-gradient(...)"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={s.show_cta ?? true}
                    onChange={(e) => set({ show_cta: e.target.checked })}
                  />
                  Show CTA chip
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">
                    Default CTA
                  </div>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.cta_label_default || ""}
                    onChange={(e) => set({ cta_label_default: e.target.value })}
                  />
                </label>
              </div>
            </fieldset>

            {/* Section */}
            <fieldset className="rounded-lg border border-gray-200">
              <legend className="px-2 text-xs font-semibold uppercase text-gray-500">
                Section
              </legend>
              <div className="p-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">
                    Background color
                  </div>
                  <input
                    type="color"
                    className="w-full h-10 p-1 border rounded-lg"
                    value={s.section_background_color || "#ffffff"}
                    onChange={(e) =>
                      set({ section_background_color: e.target.value })
                    }
                  />
                </label>
                <label className="block md:col-span-2">
                  <div className="mb-1 text-[13px] font-medium">
                    Background image URL (full bleed)
                  </div>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.section_background_image || ""}
                    onChange={(e) =>
                      set({ section_background_image: e.target.value })
                    }
                    placeholder="https://…"
                  />
                </label>
                <label className="block md:col-span-2">
                  <div className="mb-1 text-[13px] font-medium">
                    Background tint (CSS color or 'transparent')
                  </div>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.section_background_tint || ""}
                    onChange={(e) =>
                      set({ section_background_tint: e.target.value })
                    }
                    placeholder="rgba(255,255,255,0.88)"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={s.show_dots_mobile ?? true}
                    onChange={(e) =>
                      set({ show_dots_mobile: e.target.checked })
                    }
                  />
                  Show dots on mobile
                </label>
              </div>
            </fieldset>

            {/* Advanced */}
            <fieldset className="rounded-lg border border-gray-200">
              <legend className="px-2 text-xs font-semibold uppercase text-gray-500">
                Advanced
              </legend>
              <div className="p-4 grid sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <div className="mb-1 text-[13px] font-medium">Custom CSS</div>
                  <textarea
                    rows={6}
                    className="w-full rounded-lg border px-3 py-2 font-mono text-xs"
                    value={s.custom_css || ""}
                    onChange={(e) => set({ custom_css: e.target.value })}
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-[13px] font-medium">Visibility</div>
                  <select
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={s.visibility || "all"}
                    onChange={(e) => set({ visibility: e.target.value as any })}
                  >
                    <option value="all">all</option>
                    <option value="desktop">desktop</option>
                    <option value="mobile">mobile</option>
                  </select>
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersCollectionsSettingsCard;
