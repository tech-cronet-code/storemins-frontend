// SizeSelector.tsx
import React from "react";

export interface SizeOption {
  value: string | number;
  available: boolean;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selected: string | number | null;
  onSelect: (s: string | number) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selected,
  onSelect,
}) => {
  return (
    <div className="mb-5">
      <div className="text-sm font-medium mb-1">Select size</div>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((s) => {
          const isSelected = selected === s.value;
          return (
            <button
              key={String(s.value)}
              onClick={() => onSelect(s.value)}
              className={`
                px-4 py-2 rounded border text-sm font-medium flex items-center justify-center transition relative
                ${
                  !s.available
                    ? "text-blue-200 border-blue-200 bg-white line-through"
                    : ""
                }
                ${
                  isSelected && s.available
                    ? "border-blue-600 bg-blue-50"
                    : !isSelected && s.available
                    ? "border-gray-300 hover:border-gray-500"
                    : ""
                }
              `}
              aria-label={`Size ${s.value}`}
              aria-disabled={!s.available}
            >
              {s.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
