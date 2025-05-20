// components/dashboard/ShortcutModal.tsx
import React from "react";
import { X } from "lucide-react";

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: { label: string; icon: React.ReactNode; added: boolean }[];
  onToggle: (label: string) => void;
  onSave: () => void;
}

const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  onToggle,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-base font-semibold text-gray-800">
            Add new shortcut
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <input
            placeholder="Search for features or plugins..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />

          <ul className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {shortcuts.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6">{item.icon}</div>
                  <span className="text-sm text-gray-800">{item.label}</span>
                </div>
                <button
                  className={`text-sm font-semibold ${
                    item.added ? "text-red-500" : "text-blue-600"
                  } hover:underline`}
                  onClick={() => onToggle(item.label)}
                >
                  {item.added ? "REMOVE" : "ADD"}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <button
              onClick={onSave}
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutModal;
