import { Check } from "lucide-react";
import React, { useState, useRef } from "react";

interface GeneralSettingsProps {
  generalSettings: any;
  onChange: (data: any) => void;
}

const fonts = [
  "Alegreya",
  "Amatic SC",
  "Arial",
  "Bree Serif",
  "Calibri",
  "Cambria",
];

const borderStyles = [
  { label: "Square", value: "0px" },
  { label: "Soft Rounded", value: "12px" },
  { label: "Rounded", value: "9999px" },
];

const themeColors = [
  "#296FC2",
  "#E02858",
  "#2A5EE1",
  "#29A56C",
  "#F6740C",
  "#29A56C",
  "#F6740C",
];

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  generalSettings,
  onChange,
}) => {
  const [fontOpen, setFontOpen] = useState(false);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      {/* Font Selector */}
      <div className="relative">
        <label className="block font-medium mb-1">Choose Font</label>
        <div
          onClick={() => setFontOpen(!fontOpen)}
          className="w-full border border-gray-200 rounded px-3 py-2 cursor-pointer bg-white flex justify-between items-center focus:outline-none focus-visible:outline-none focus:ring-0"
          tabIndex={0}
        >
          <span style={{ fontFamily: generalSettings.font }}>
            {generalSettings.font}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              fontOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {fontOpen && (
          <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded border border-gray-100  shadow-lg bg-white">
            {fonts.map((font) => (
              <div
                key={font}
                onClick={() => {
                  onChange({ ...generalSettings, font });
                  setFontOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  generalSettings.font === font
                    ? "bg-gray-100 font-semibold"
                    : ""
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Border Radius Selector */}
      <div className="relative">
        <label className="block font-medium mb-1">
          Border Radius For Buttons
        </label>
        <div
          onClick={() => setRadiusOpen(!radiusOpen)}
          className="w-full border border-gray-200  rounded px-3 py-2 cursor-pointer bg-white flex items-center gap-2 focus:outline-none focus-visible:outline-none focus:ring-0"
          tabIndex={0}
        >
          <div
            className="w-6 h-6 border"
            style={{ borderRadius: generalSettings.borderRadius }}
          />
          {borderStyles.find((b) => b.value === generalSettings.borderRadius)
            ?.label || "Select"}
        </div>

        {radiusOpen && (
          <div className="absolute z-20 mt-1 w-full rounded border  border-gray-200 shadow-lg bg-white">
            {borderStyles.map((style) => (
              <div
                key={style.value}
                onClick={() => {
                  onChange({ ...generalSettings, borderRadius: style.value });
                  setRadiusOpen(false);
                }}
                className={`px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 ${
                  generalSettings.borderRadius === style.value
                    ? "bg-gray-100 font-semibold"
                    : ""
                }`}
              >
                <div
                  className="w-6 h-6 border"
                  style={{ borderRadius: style.value }}
                />
                {style.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme Color */}
      <div>
        <label className="block font-medium mb-1">Choose a Theme Color</label>
        <div className="relative flex items-center gap-2">
          <button
            className="text-blue-600 px-2 z-10 focus:outline-none"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -100, behavior: "smooth" })
            }
          >
            &lt;
          </button>

          <div className="relative w-full overflow-hidden">
            <div
              className="flex gap-6 py-2 px-1 overflow-x-auto scroll-smooth"
              ref={scrollRef}
              style={{ scrollBehavior: "smooth" }}
            >
              {themeColors.map((color, index) => {
                const isSelected = generalSettings.themeColor === color;
                return (
                  <div
                    key={`${color}-${index}`}
                    className="flex flex-col items-center gap-1 min-w-[60px] shrink-0"
                  >
                    <div
                      onClick={() =>
                        onChange({ ...generalSettings, themeColor: color })
                      }
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-green-600"
                          : "border border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {isSelected && (
                        <Check className="text-white w-4 h-4" strokeWidth={3} />
                      )}
                    </div>
                    <div
                      className={`text-xs ${
                        isSelected ? "font-bold text-gray-800" : "text-gray-500"
                      }`}
                    >
                      Color
                    </div>
                    <div
                      className={`text-xs ${
                        isSelected
                          ? "text-gray-700 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {color.replace("#", "")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="text-blue-600 px-2 z-10 focus:outline-none"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 100, behavior: "smooth" })
            }
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Call to Action Toggles */}
      <div>
        <label className="block font-medium mb-1">
          Product Card - Call to Actions
        </label>
        <div className="space-y-2">
          {[
            { label: "Add to Cart", key: "addToCart" },
            { label: "Buy Now", key: "buyNow" },
            { label: "WhatsApp", key: "showWhatsApp" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={generalSettings[item.key]}
                onChange={(e) =>
                  onChange({
                    ...generalSettings,
                    [item.key]: e.target.checked,
                  })
                }
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
