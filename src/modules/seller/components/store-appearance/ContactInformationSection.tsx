import React, { useState } from "react";

const ContactInformationSection: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Heading */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Contact Information
        </h3>
        <p className="text-sm text-gray-500">
          Contact details displayed on your website so customers can reach out
          easily.
        </p>
      </div>

      {/* Phone and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            This will be displayed on the website
          </p>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            This will be displayed on the website
          </p>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          WhatsApp Number
        </label>
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="Enter WhatsApp number"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          This will be displayed on the website
        </p>
      </div>
    </div>
  );
};

export default ContactInformationSection;
