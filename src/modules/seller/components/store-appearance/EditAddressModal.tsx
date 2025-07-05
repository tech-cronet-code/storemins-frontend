// src/modules/store/containers/EditAddressModal.tsx

import React from "react";
import { X } from "lucide-react";

interface EditAddressModalProps {
  open: boolean;
  onClose: () => void;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  onSave: (updatedAddress: EditAddressModalProps["address"]) => void;
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Lakshadweep Islands", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  open,
  onClose,
  address,
  onSave,
}) => {
  const [form, setForm] = React.useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    pincode: "",
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        street1: address.street1 ?? "",
        street2: address.street2 ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        pincode: address.pincode ?? "",
      });
    }
  }, [open, address]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 flex min-h-screen items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-xl p-6 sm:p-8 shadow-2xl transition-all animate-fadeIn relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Address</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Street 1</label>
              <input
                value={form.street1}
                onChange={(e) => handleChange("street1", e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="House No., Building, Area"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Street 2</label>
              <input
                value={form.street2}
                onChange={(e) => handleChange("street2", e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Landmark, Nearby"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Pincode</label>
                <input
                  value={form.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 380001"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Ahmedabad"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">State</label>
                <select
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  onSave({ ...form, street2: form.street2 ?? "" });
                  onClose();
                }}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditAddressModal;
