// StoreFont.tsx
// A minimal font-picker dropdown without a search box.
// Keeps “Recommended” font(s) at the top and highlights the selected value.

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const FONT_OPTIONS = [
  "Galano Grotesque",
  "Alegreya",
  "Amatic SC",
  "Arial",
  "Abril Fatface",
  "Aclonica",
  "Acme",
  "Actor",
  "Bree Serif",
  "Calibri",
  "Cambria",
];

const RECOMMENDED = ["Galano Grotesque"]; // top-priority fonts

interface Props {
  value: string;
  onChange: (font: string) => void;
}

const StoreFont: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  /* Close dropdown on outside click --------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  /* Compose list with recommended fonts on top ---------------------------- */
  const list = [
    ...RECOMMENDED,
    ...FONT_OPTIONS.filter((f) => !RECOMMENDED.includes(f)),
  ];

  /* Keyboard navigation --------------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActive((i) => (i + 1) % list.length);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setActive((i) => (i - 1 + list.length) % list.length);
        e.preventDefault();
      } else if (e.key === "Enter") {
        onChange(list[active]);
        setOpen(false);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, list, active, onChange]);

  /* Auto-scroll highlighted item ----------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((p) => !p);
          setActive(0);
        }}
        className={clsx(
          "w-full border rounded px-3 py-2 flex justify-between items-center",
          "bg-white text-left",
          open ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"
        )}
      >
        <span style={{ fontFamily: value }}>{value}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded border border-gray-200 bg-white shadow-md"
        >
          {list.map((font, idx) => {
            const isActive = idx === active;
            const isSelected = font === value;
            const isRecommended = RECOMMENDED.includes(font);

            return (
              <li
                key={font}
                onMouseEnter={() => setActive(idx)}
                onClick={() => {
                  onChange(font);
                  setOpen(false);
                }}
                className={clsx(
                  "cursor-pointer select-none px-4 py-2 flex justify-between",
                  isActive && "bg-gray-100",
                  isSelected && "font-semibold"
                )}
                style={{ fontFamily: font }}
              >
                {font}
                {isRecommended && (
                  <span className="ml-2 text-xs text-blue-600">
                    (Recommended)
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StoreFont;
