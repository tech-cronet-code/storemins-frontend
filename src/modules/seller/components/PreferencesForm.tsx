import React, { useState } from "react";

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    currency: "USD",
    timezone: "(GMT-12:00) International Date Line West",
    notifyDigital: true,
    notifyMerchant: false,
    notifyRecommendations: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setPreferences((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saved Preferences:", preferences);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl px-4 py-6 sm:p-6 md:p-8 max-w-5xl mx-auto w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Currency
          </label>
          <select
            name="currency"
            value={preferences.currency}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Time Zone
          </label>
          <select
            name="timezone"
            value={preferences.timezone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="(GMT-12:00) International Date Line West">
              (GMT-12:00) International Date Line West
            </option>
            <option value="(GMT+0:00) UTC">(GMT+0:00) UTC</option>
            <option value="(GMT+5:30) India Standard Time">
              (GMT+5:30) India Standard Time
            </option>
            <option value="(GMT+1:00) Central European Time">
              (GMT+1:00) Central European Time
            </option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-semibold text-gray-800 mb-4 block">
          Notification
        </label>

        <div className="space-y-4">
          {[
            {
              name: "notifyDigital",
              label: "I send or receive digital currency",
              checked: preferences.notifyDigital,
            },
            {
              name: "notifyMerchant",
              label: "I receive merchant order",
              checked: preferences.notifyMerchant,
            },
            {
              name: "notifyRecommendations",
              label: "There are recommendations for my account",
              checked: preferences.notifyRecommendations,
            },
          ].map((item) => (
            <label
              key={item.name}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="relative inline-block">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={item.checked}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-[38px] h-[22px] rounded-full flex items-center transition-colors duration-300 ${
                    item.checked ? "bg-[#00E0C6]" : "bg-[#E6E8F0]"
                  }`}
                >
                  <div
                    className={`w-[18px] h-[18px] bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                      item.checked ? "translate-x-[16px]" : "translate-x-[2px]"
                    }`}
                  ></div>
                </div>
              </span>
              <span className="text-sm text-gray-800">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 text-right">
        <button
          type="submit"
          className="bg-[#130CED] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-blue-800 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PreferencesForm;
