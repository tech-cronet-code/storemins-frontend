/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { AboutUsUI, defaultAboutUsUI } from "../../../../shared/blocks/about_Us";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block text-sm mb-1">{label}</span>
    {children}
  </label>
);

export const AboutUsSettingsCard: React.FC<{
  ui: Partial<AboutUsUI> | undefined;
  onChange: (next: Partial<AboutUsUI>) => void;
}> = ({ ui, onChange }) => {
  const s: AboutUsUI = { ...defaultAboutUsUI, ...(ui || {}) } as AboutUsUI;
  const set = (patch: Partial<AboutUsUI>) => onChange({ ...s, ...patch });

  const [itemsText, setItemsText] = useState<string>(
    JSON.stringify(s.items, null, 2)
  );
  const [err, setErr] = useState<string | null>(null);

  const applyItems = () => {
    try {
      const arr = JSON.parse(itemsText);
      if (!Array.isArray(arr)) throw new Error("Must be an array");
      set({ items: arr });
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Invalid JSON");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">About Us</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.enabled}
            onChange={(e) => set({ enabled: e.target.checked })}
          />
          Enabled
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Show Title">
          <input
            type="checkbox"
            checked={s.display_title}
            onChange={(e) => set({ display_title: e.target.checked })}
          />
        </Field>
        <Field label="Show Subtitle">
          <input
            type="checkbox"
            checked={s.display_subtitle}
            onChange={(e) => set({ display_subtitle: e.target.checked })}
          />
        </Field>
        {s.display_title && (
          <>
            <Field label="Title">
              <input
                className="w-full border rounded px-3 py-2"
                value={s.title}
                onChange={(e) => set({ title: e.target.value })}
              />
            </Field>
            <Field label="Title Color">
              <input
                type="color"
                className="w-full h-10 p-1 border rounded"
                value={s.title_color}
                onChange={(e) => set({ title_color: e.target.value })}
              />
            </Field>
          </>
        )}
        {s.display_subtitle && (
          <>
            <Field label="Subtitle">
              <input
                className="w-full border rounded px-3 py-2"
                value={s.subtitle}
                onChange={(e) => set({ subtitle: e.target.value })}
              />
            </Field>
            <Field label="Subtitle Color">
              <input
                type="color"
                className="w-full h-10 p-1 border rounded"
                value={s.subtitle_color}
                onChange={(e) => set({ subtitle_color: e.target.value })}
              />
            </Field>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Align">
          <select
            className="w-full border rounded px-3 py-2"
            value={s.align}
            onChange={(e) => set({ align: e.target.value as any })}
          >
            <option>left</option>
            <option>center</option>
            <option>right</option>
          </select>
        </Field>
        <Field label="Tablet Columns">
          <select
            className="w-full border rounded px-3 py-2"
            value={String(s.grid_tablet_columns)}
            onChange={(e) =>
              set({ grid_tablet_columns: Number(e.target.value) as any })
            }
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </Field>
        <Field label="Desktop Columns">
          <select
            className="w-full border rounded px-3 py-2"
            value={String(s.grid_desktop_columns)}
            onChange={(e) =>
              set({ grid_desktop_columns: Number(e.target.value) as any })
            }
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Card Radius">
          <select
            className="w-full border rounded px-3 py-2"
            value={s.card_radius}
            onChange={(e) => set({ card_radius: e.target.value as any })}
          >
            {["none", "sm", "md", "lg", "xl", "2xl", "full"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Card Shadow">
          <select
            className="w-full border rounded px-3 py-2"
            value={s.card_shadow}
            onChange={(e) => set({ card_shadow: e.target.value as any })}
          >
            {["none", "sm", "md", "lg"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Show Card Divider">
          <input
            type="checkbox"
            checked={s.card_divider}
            onChange={(e) => set({ card_divider: e.target.checked })}
          />
        </Field>
        <Field label="Use Accordion (collapsible)">
          <input
            type="checkbox"
            checked={s.use_accordion}
            onChange={(e) => set({ use_accordion: e.target.checked })}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Section Background">
          <input
            type="color"
            className="w-full h-10 p-1 border rounded"
            value={s.section_background_color}
            onChange={(e) => set({ section_background_color: e.target.value })}
          />
        </Field>
        <Field label="Visibility">
          <select
            className="w-full border rounded px-3 py-2"
            value={s.visibility}
            onChange={(e) => set({ visibility: e.target.value as any })}
          >
            <option>all</option>
            <option>desktop</option>
            <option>mobile</option>
          </select>
        </Field>
      </div>

      <div className="space-y-2">
        <span className="block text-sm">
          Items JSON (key, icon, title, bullets[])
        </span>
        <textarea
          className="w-full border rounded px-3 py-2 font-mono text-xs"
          rows={10}
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            onClick={applyItems}
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
          >
            Apply
          </button>
          {err ? <span className="text-red-600 text-sm">{err}</span> : null}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Top Margin">
          <input
            className="w-full border rounded px-3 py-2"
            value={s.section_top_margin}
            onChange={(e) => set({ section_top_margin: e.target.value })}
          />
        </Field>
        <Field label="Bottom Margin">
          <input
            className="w-full border rounded px-3 py-2"
            value={s.section_bottom_margin}
            onChange={(e) => set({ section_bottom_margin: e.target.value })}
          />
        </Field>
      </div>

      <div>
        <Field label="Custom CSS">
          <textarea
            className="w-full border rounded px-3 py-2 font-mono text-xs"
            rows={5}
            value={s.custom_css || ""}
            onChange={(e) => set({ custom_css: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
};

export default AboutUsSettingsCard;
