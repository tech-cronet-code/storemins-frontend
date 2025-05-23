import { ChevronDown, FileText, Globe, Power, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BulkActionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-[44px] md:h-[48px] px-4 md:px-5 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 font-semibold text-sm rounded-md shadow-sm bg-white hover:bg-blue-50 transition-all"
      >
        <span className="text-[13px] md:text-sm">Bulk Actions</span>
        <ChevronDown
          className={`w-[16px] h-[16px] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[90vw] max-w-[208px] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {[
            {
              label: "Generate PDF",
              icon: <FileText className="w-4 h-4 text-gray-600" />,
            },
            {
              label: "Mark Online",
              icon: <Globe className="w-4 h-4 text-gray-600" />,
            },
            {
              label: "Mark Offline",
              icon: <Power className="w-4 h-4 text-gray-600 -scale-x-100" />,
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-4 h-4 text-red-600" />,
              className: "text-red-600 hover:bg-red-50",
            },
          ].map(
            (
              { label, icon, className = "text-gray-800 hover:bg-gray-100" },
              idx
            ) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm ${className}`}
              >
                {icon}
                <span className="flex-1">{label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default BulkActionsDropdown;
