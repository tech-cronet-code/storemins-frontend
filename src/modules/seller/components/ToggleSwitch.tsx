// ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
        enabled ? "bg-[#1D4ED8]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transform transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
