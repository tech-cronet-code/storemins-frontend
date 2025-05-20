import React, { useState } from "react";

const SecurityForm = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("🔐 Submitting security form:", {
      ...form,
      twoFactorEnabled,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl px-4 py-6 sm:p-6 md:p-8 max-w-5xl mx-auto w-full"
    >
      {/* Two-Factor Toggle */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-800 mb-2 block">
          Two-factor Authentication
        </label>
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setTwoFactorEnabled((prev) => !prev)}
        >
          <div className="relative inline-block w-[38px] h-[22px]">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={() => {}}
              className="sr-only"
            />
            <div
              className={`w-full h-full rounded-full flex items-center transition-colors duration-300 ${
                twoFactorEnabled ? "bg-[#00E0C6]" : "bg-[#E6E8F0]"
              }`}
            >
              <div
                className={`w-[18px] h-[18px] bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                  twoFactorEnabled ? "translate-x-[16px]" : "translate-x-[2px]"
                }`}
              ></div>
            </div>
          </div>
          <span className="text-sm text-gray-800">
            Enable or disable two factor authentication
          </span>
        </div>
      </div>

      {/* Change Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="mt-8 text-end">
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

export default SecurityForm;
