/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect } from "react";

export type CustomerTestimonialsUI = {
  enabled: boolean;
  section_background_color: string;

  display_title: boolean;
  title: string;
  title_color: string;

  display_subtitle: boolean;
  subtitle: string;
  subtitle_color: string;

  show_navigation: boolean;
  auto_slide: boolean;
  slide_interval: number;

  testimonials_json: string; // editable JSON array
};

export const defaultCustomerTestimonialsUI: CustomerTestimonialsUI = {
  enabled: true,
  section_background_color: "#ffffff",

  display_title: true,
  title: "What our clients say",
  title_color: "#111827",

  display_subtitle: false,
  subtitle: "",
  subtitle_color: "#374151",

  show_navigation: true,
  auto_slide: true,
  slide_interval: 5000,

  testimonials_json: JSON.stringify(
    [
      {
        name: "Stefan Jør",
        role: "Founder & CEO",
        company: "Prime Retail",
        avatar: "https://i.pravatar.cc/150?img=1",
        stars: 5,
        feedback:
          "Love the design and customization of InstaGrow. We’ve used various apps before but none this flexible.",
      },
      {
        name: "Gaurav Khe",
        role: "Business Manager",
        company: "GlowMart",
        avatar: "https://i.pravatar.cc/150?img=2",
        stars: 5,
        feedback:
          "I like the flexibility and customization options. No custom CSS required — works out of the box.",
      },
      {
        name: "Marian Campos",
        role: "Entrepreneur",
        company: "iZettle",
        avatar: "https://i.pravatar.cc/150?img=3",
        stars: 4,
        feedback:
          "A very well-done plugin that now works exactly as advertised. Best Facebook integration I’ve used.",
      },
    ],
    null,
    2
  ),
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="block">
    <span className="block text-sm mb-1">{label}</span>
    {children}
  </label>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
    {children}
  </div>
);

const Switch: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
);

export const CustomerTestimonialsSettingsCard: React.FC<{
  ui: CustomerTestimonialsUI;
  onChange: (next: CustomerTestimonialsUI) => void;
}> = ({ ui, onChange }) => {
  const s = useMemo(
    () => ({ ...defaultCustomerTestimonialsUI, ...(ui || {}) }),
    [ui]
  );
  const set = (patch: Partial<CustomerTestimonialsUI>) =>
    onChange({ ...s, ...patch });

  // live JSON validation state
  const [jsonError, setJsonError] = useState<string | null>(null);

  // keep validation in sync whenever text changes
  useEffect(() => {
    try {
      if (s.testimonials_json?.trim()) {
        const parsed = JSON.parse(s.testimonials_json);
        if (!Array.isArray(parsed)) throw new Error("Must be an array");
      }
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e?.message || "Invalid JSON");
    }
  }, [s.testimonials_json]);

  return (
    <div className="rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Testimonials</h3>
        <Switch
          checked={s.enabled}
          onChange={(v) => set({ enabled: v })}
          label="Enabled"
        />
      </div>

      <Row>
        <Field label="Section background">
          <input
            type="color"
            className="w-full h-10 p-1 border rounded"
            value={s.section_background_color}
            onChange={(e) => set({ section_background_color: e.target.value })}
          />
        </Field>
        <div className="flex items-end gap-6">
          <Switch
            checked={s.show_navigation}
            onChange={(v) => set({ show_navigation: v })}
            label="Show arrows"
          />
          <Switch
            checked={s.auto_slide}
            onChange={(v) => set({ auto_slide: v })}
            label="Auto slide"
          />
        </div>
        <Field label="Slide interval (ms)">
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            min={1500}
            step={100}
            value={s.slide_interval}
            onChange={(e) =>
              set({ slide_interval: Number(e.target.value) || 5000 })
            }
          />
        </Field>
      </Row>

      <Row>
        <div className="space-y-2">
          <Switch
            checked={s.display_title}
            onChange={(v) => set({ display_title: v })}
            label="Display title"
          />
          <Field label="Title">
            <input
              className="w-full border rounded px-3 py-2"
              value={s.title}
              onChange={(e) => set({ title: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Title color">
          <input
            type="color"
            className="w-full h-10 p-1 border rounded"
            value={s.title_color}
            onChange={(e) => set({ title_color: e.target.value })}
          />
        </Field>
        <div />
      </Row>

      <Row>
        <div className="space-y-2">
          <Switch
            checked={s.display_subtitle}
            onChange={(v) => set({ display_subtitle: v })}
            label="Display subtitle"
          />
          <Field label="Subtitle">
            <input
              className="w-full border rounded px-3 py-2"
              value={s.subtitle}
              onChange={(e) => set({ subtitle: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Subtitle color">
          <input
            type="color"
            className="w-full h-10 p-1 border rounded"
            value={s.subtitle_color}
            onChange={(e) => set({ subtitle_color: e.target.value })}
          />
        </Field>
        <div />
      </Row>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Testimonials JSON</h4>
          {jsonError ? (
            <span className="text-xs text-red-600">{jsonError}</span>
          ) : (
            <span className="text-xs text-gray-500">Valid JSON</span>
          )}
        </div>
        <textarea
          className={`w-full border rounded px-3 py-2 font-mono text-xs ${
            jsonError ? "border-red-400" : ""
          }`}
          rows={10}
          value={s.testimonials_json}
          onChange={(e) => set({ testimonials_json: e.target.value })}
        />
      </div>
    </div>
  );
};
