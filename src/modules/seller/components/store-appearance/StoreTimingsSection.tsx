import React, { useState } from "react";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeOptions = [
  "24 hours",
  "12:00 AM",
  "12:30 AM",
  "01:00 AM",
  "01:30 AM",
  "02:00 AM",
  "02:30 AM",
  "03:00 AM",
  "03:30 AM",
  "04:00 AM",
  "04:30 AM",
  "05:00 AM",
  "05:30 AM",
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
];

const StoreTimingSection: React.FC = () => {
  const [storeTimings, setStoreTimings] = useState(
    daysOfWeek.map((day) => ({
      day,
      isOpen: true,
      time: "24 hours",
    }))
  );

  const handleToggle = (index: number) => {
    const updated = [...storeTimings];
    updated[index].isOpen = !updated[index].isOpen;
    setStoreTimings(updated);
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...storeTimings];
    updated[index].time = value;
    setStoreTimings(updated);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-800">Store timings</h3>
      <p className="text-sm text-gray-500 mb-6">
        Your store will be automatically switched online/offline based on the
        hours you choose.
      </p>

      <div className="space-y-4">
        {storeTimings.map((timing, index) => (
          <div
            key={timing.day}
            className="flex items-center justify-between gap-4"
          >
            {/* Day label */}
            <div className="w-1/4 font-medium text-gray-800">{timing.day}</div>

            {/* Toggle & status */}
            <div className="flex items-center gap-3 w-1/3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={timing.isOpen}
                  onChange={() => handleToggle(index)}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors 
                  ${timing.isOpen ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <div
                  className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full 
                  transition-transform ${
                    timing.isOpen ? "translate-x-full" : ""
                  }`}
                ></div>
              </label>
              <span className="text-sm text-gray-700">
                {timing.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            {/* Time Dropdown Placeholder (hidden instead of removed) */}
            <div className="w-36">
              {timing.isOpen ? (
                <select
                  value={timing.time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="h-[38px]"></div> // keep space to prevent layout shift
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreTimingSection;
