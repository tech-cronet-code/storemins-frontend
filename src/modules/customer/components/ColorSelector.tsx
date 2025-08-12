// ColorSelector.tsx
import React from "react";

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="mb-5">
      <div className="text-sm font-medium mb-1">Select color</div>
      <div className="flex gap-3">
        {colors.map((c) => (
          <button
            key={c.id}
            aria-label={c.name}
            onClick={() => onSelect(c.id)}
            className="relative w-10 h-10 rounded border flex items-center justify-center focus:outline-none transition"
            style={{
              backgroundColor: c.hex,
              border:
                selectedId === c.id ? "2px solid #1f4ed8" : "1px solid #d1d5db",
            }}
          >
            {selectedId === c.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
