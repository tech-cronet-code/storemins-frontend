import React, { useState } from "react";
import { Pencil } from "lucide-react";
import EditAddressModal from "./EditAddressModal";

const BusinessInformationSection: React.FC = () => {
  const [legalName, setLegalName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [cin, setCin] = useState("");
  const [fssai, setFssai] = useState("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    street1: "2240, Jamalpur",
    street2: "",
    pincode: "380001",
    city: "Ahmedabad",
    state: "Gujarat",
  });

  const formattedAddress = `${address.street1}, ${address.city}, ${address.state}, ${address.pincode}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Heading */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Business Information
        </h3>
        <p className="text-sm text-gray-500">
          Submit Your Details to Formalize Your Business
        </p>
      </div>

      {/* Legal Name */}
      <div className="space-y-1">
        <label
          htmlFor="legalName"
          className="text-sm font-medium text-gray-700"
        >
          Legal Name
        </label>
        <input
          id="legalName"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          type="text"
          placeholder="Enter legal name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Business Type */}
      <div className="space-y-1">
        <label
          htmlFor="businessType"
          className="text-sm font-medium text-gray-700"
        >
          Business Type
        </label>
        <select
          id="businessType"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Select</option>
          <option value="private_limited">Private Limited</option>
          <option value="partnership">Partnership</option>
          <option value="sole_proprietorship">Sole Proprietorship</option>
        </select>
      </div>

      {/* GST and CIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="gst" className="text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            id="gst"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            type="text"
            placeholder="Enter GST number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cin" className="text-sm font-medium text-gray-700">
            CIN
          </label>
          <input
            id="cin"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            type="text"
            placeholder="Enter CIN"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      {/* FSSAI License Number */}
      <div className="space-y-1">
        <label htmlFor="fssai" className="text-sm font-medium text-gray-700">
          FSSAI License Number
        </label>
        <input
          id="fssai"
          value={fssai}
          onChange={(e) => setFssai(e.target.value)}
          type="text"
          placeholder="Enter FSSAI license number"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Address with Edit */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm text-gray-700">🏠 {formattedAddress}</div>
          <button
            type="button"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
            onClick={() => setShowAddressModal(true)}
          >
            <Pencil size={16} className="text-blue-600" />
            Edit
          </button>
        </div>
      </div>

      {/* Address Modal */}
      <EditAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        address={address}
        onSave={(updated) =>
          setAddress({
            ...updated,
            street2: updated.street2 ?? "",
          })
        }
      />
    </div>
  );
};

export default BusinessInformationSection;
