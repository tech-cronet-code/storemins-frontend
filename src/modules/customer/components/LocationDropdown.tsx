// LocationDropdown.tsx

import React, { useEffect, useRef, useState } from "react";
import { MdLocationOn } from "react-icons/md";

const LocationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Permission denied. Please allow location access.");
        } else {
          setError("Failed to get location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative">
      <button
        ref={(el) => (buttonRef.current = el)}
        aria-label="Location"
        className="p-2 hover:bg-gray-100 rounded-full flex items-center justify-center"
        onClick={() => setOpen((o) => !o)}
      >
        <MdLocationOn className="text-[22px]" />
      </button>

      {open && (
        <div
          ref={(el) => (dropdownRef.current = el)}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden text-sm z-50"
        >
          {/* Arrow caret */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 shadow-sm" />
          </div>

          {/* Header */}
          <div className="px-4 py-3 border-b">
            <div className="font-medium">Provide Current Location</div>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            <button
              onClick={handleUseMyLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-600 rounded-md px-3 py-2 hover:bg-red-50 transition"
            >
              <MdLocationOn />
              {loading ? (
                <span className="text-sm">Locating...</span>
              ) : (
                <span className="text-sm">Use My Current Location</span>
              )}
            </button>
            {error && <div className="mt-2 text-red-600 text-xs">{error}</div>}
            {coords && !error && (
              <div className="mt-2 text-gray-700 text-xs">
                <div>
                  <strong>Latitude:</strong> {coords.lat.toFixed(5)}
                </div>
                <div>
                  <strong>Longitude:</strong> {coords.lng.toFixed(5)}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-4 py-3 text-center text-xs flex items-center justify-center gap-2">
            <div className="text-gray-600 flex items-center gap-1">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="inline-block"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a7 7 0 1 0 7 7A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 3a6 6 0 0 1 0 12zm.93-7.588-2.29.287-.082.38.45.083c.294.066.352.176.288.469l-.738 3.468c-.194.917.105 1.319.808 1.319.545 0 .875-.252.992-.598l.088-.416c.066-.31.126-.38.42-.446l.522-.088.082-.381-.45-.083c-.294-.066-.352-.176-.288-.47l.738-3.468c.194-.917-.105-1.319-.808-1.319-.545 0-.875.252-.992.598l-.088.416c-.066.31-.126.38-.42.446l-.522.088z" />
              </svg>
              <span>Sign in to see your saved address</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
